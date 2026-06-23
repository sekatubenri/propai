-- ========================================
-- PropAI データベーススキーマ
-- Supabaseのクエリエディタで実行してください
-- ========================================

-- ユーザープロファイルテーブル
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  company_name TEXT,
  plan TEXT NOT NULL DEFAULT 'free', -- free / starter / standard / pro
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'inactive', -- active / inactive / canceled / past_due
  generation_count INTEGER NOT NULL DEFAULT 0, -- 今月の生成数
  generation_limit INTEGER NOT NULL DEFAULT 0, -- プランの上限（0=無料=5件）
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 生成履歴テーブル
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  input_data JSONB NOT NULL, -- 入力内容
  output_text TEXT NOT NULL, -- 生成結果
  generation_type TEXT NOT NULL DEFAULT 'property', -- property / email / sns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 毎月1日に生成数をリセットする関数
CREATE OR REPLACE FUNCTION reset_monthly_generation_count()
RETURNS void AS $$
  UPDATE profiles SET generation_count = 0;
$$ LANGUAGE sql;

-- 生成数をインクリメントする関数
CREATE OR REPLACE FUNCTION increment_generation_count(user_id UUID)
RETURNS void AS $$
  UPDATE profiles
  SET generation_count = generation_count + 1,
      updated_at = NOW()
  WHERE id = user_id;
$$ LANGUAGE sql;

-- 新規ユーザー登録時にprofilesを自動作成するトリガー
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security（ユーザーは自分のデータのみアクセス可能）
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "自分のプロファイルのみ参照可能" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "自分のプロファイルのみ更新可能" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "自分の生成履歴のみ参照可能" ON generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "自分の生成履歴のみ作成可能" ON generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service Roleはすべてのデータにアクセス可能（Webhook用）
CREATE POLICY "Service role full access profiles" ON profiles
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access generations" ON generations
  USING (auth.role() = 'service_role');
