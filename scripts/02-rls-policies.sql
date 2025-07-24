-- Politiques de sécurité Row Level Security (RLS)

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table profiles
CREATE POLICY "Les utilisateurs peuvent voir tous les profils publics" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent insérer leur propre profil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiques pour la table products
CREATE POLICY "Tout le monde peut voir les produits actifs" ON products
  FOR SELECT USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leurs propres produits" ON products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les propriétaires peuvent modifier leurs produits" ON products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Les propriétaires peuvent supprimer leurs produits" ON products
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour la table comments
CREATE POLICY "Tout le monde peut voir les commentaires" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Les utilisateurs connectés peuvent créer des commentaires" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres commentaires" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres commentaires" ON comments
  FOR DELETE USING (auth.uid() = user_id);
