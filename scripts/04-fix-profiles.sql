-- Script pour corriger les profils manquants

-- Fonction pour créer les profils manquants
CREATE OR REPLACE FUNCTION create_missing_profiles()
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Parcourir tous les utilisateurs qui n'ont pas de profil
  FOR user_record IN 
    SELECT au.id, au.email, au.raw_user_meta_data
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    WHERE p.id IS NULL
  LOOP
    -- Créer le profil manquant
    INSERT INTO public.profiles (id, username, email, role)
    VALUES (
      user_record.id,
      COALESCE(
        user_record.raw_user_meta_data->>'username',
        split_part(user_record.email, '@', 1)
      ),
      user_record.email,
      'standard'
    )
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Profil créé pour utilisateur: %', user_record.email;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Exécuter la fonction pour créer les profils manquants
SELECT create_missing_profiles();

-- Vérifier que tous les utilisateurs ont maintenant un profil
SELECT 
  COUNT(*) as total_users,
  (SELECT COUNT(*) FROM profiles) as total_profiles
FROM auth.users;
