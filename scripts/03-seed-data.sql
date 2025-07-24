-- Données de test pour l'application

-- Note: Les profils utilisateurs seront créés automatiquement lors de l'inscription
-- via le trigger handle_new_user()

-- Insérer des produits de démonstration
-- Ces insertions ne fonctionneront qu'après avoir créé des utilisateurs réels
-- via l'interface d'inscription

-- Exemple de données à insérer manuellement après création d'utilisateurs :

/*
-- Remplacer 'USER_UUID_HERE' par un vrai UUID d'utilisateur

INSERT INTO products (title, description, image_url, user_id, status) VALUES
  (
    'MacBook Pro M3',
    'Ordinateur portable haute performance avec puce M3, parfait pour le développement et la création de contenu. Écran Retina 14 pouces, 16GB RAM, 512GB SSD.',
    '/placeholder.svg?height=400&width=600',
    'USER_UUID_HERE',
    'active'
  ),
  (
    'iPhone 15 Pro',
    'Le dernier smartphone d''Apple avec puce A17 Pro, appareil photo professionnel et design en titane. Disponible en plusieurs coloris.',
    '/placeholder.svg?height=400&width=600',
    'USER_UUID_HERE',
    'active'
  ),
  (
    'Chaise de Bureau Ergonomique',
    'Chaise de bureau haut de gamme avec support lombaire ajustable, accoudoirs 4D et mécanisme d''inclinaison. Parfaite pour de longues sessions de travail.',
    '/placeholder.svg?height=400&width=600',
    'USER_UUID_HERE',
    'active'
  ),
  (
    'Casque Audio Sony WH-1000XM5',
    'Casque sans fil avec réduction de bruit active de pointe, qualité audio exceptionnelle et autonomie de 30 heures.',
    '/placeholder.svg?height=400&width=600',
    'USER_UUID_HERE',
    'active'
  ),
  (
    'Clavier Mécanique Gaming',
    'Clavier mécanique RGB avec switches Cherry MX, touches programmables et repose-poignet. Idéal pour le gaming et la programmation.',
    '/placeholder.svg?height=400&width=600',
    'USER_UUID_HERE',
    'active'
  ),
  (
    'Moniteur 4K 27 pouces',
    'Écran 4K IPS 27 pouces avec calibrage colorimétrique professionnel, parfait pour la création graphique et le développement.',
    '/placeholder.svg?height=400&width=600',
    'USER_UUID_HERE',
    'active'
  );

-- Insérer des commentaires de démonstration
INSERT INTO comments (content, user_id, product_id) VALUES
  (
    'Excellent produit ! La qualité est au rendez-vous et la livraison a été rapide. Je recommande vivement.',
    'USER_UUID_HERE',
    (SELECT id FROM products WHERE title = 'MacBook Pro M3' LIMIT 1)
  ),
  (
    'Très satisfait de mon achat. Le rapport qualité-prix est excellent et le service client est réactif.',
    'USER_UUID_HERE',
    (SELECT id FROM products WHERE title = 'iPhone 15 Pro' LIMIT 1)
  ),
  (
    'Produit conforme à la description. Emballage soigné et expédition rapide. Parfait !',
    'USER_UUID_HERE',
    (SELECT id FROM products WHERE title = 'Chaise de Bureau Ergonomique' LIMIT 1)
  );
*/

-- Pour l'instant, créons juste une fonction utilitaire pour insérer des données de test
CREATE OR REPLACE FUNCTION create_sample_data()
RETURNS void AS $$
DECLARE
  sample_user_id UUID;
BEGIN
  -- Récupérer le premier utilisateur disponible
  SELECT id INTO sample_user_id FROM profiles LIMIT 1;
  
  -- Si aucun utilisateur n'existe, sortir
  IF sample_user_id IS NULL THEN
    RAISE NOTICE 'Aucun utilisateur trouvé. Créez d''abord un compte utilisateur.';
    RETURN;
  END IF;
  
  -- Insérer des produits de démonstration
  INSERT INTO products (title, description, image_url, user_id, status) VALUES
    (
      'MacBook Pro M3',
      'Ordinateur portable haute performance avec puce M3, parfait pour le développement et la création de contenu.',
      '/placeholder.svg?height=400&width=600',
      sample_user_id,
      'active'
    ),
    (
      'iPhone 15 Pro',
      'Le dernier smartphone d''Apple avec puce A17 Pro, appareil photo professionnel et design en titane.',
      '/placeholder.svg?height=400&width=600',
      sample_user_id,
      'active'
    ),
    (
      'Chaise de Bureau Ergonomique',
      'Chaise de bureau haut de gamme avec support lombaire ajustable, accoudoirs 4D et mécanisme d''inclinaison.',
      '/placeholder.svg?height=400&width=600',
      sample_user_id,
      'active'
    )
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE 'Données de test créées avec succès !';
END;
$$ LANGUAGE plpgsql;

-- Pour exécuter cette fonction après avoir créé des utilisateurs :
-- SELECT create_sample_data();
