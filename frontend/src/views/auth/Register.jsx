// frontend/src/views/auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    strength: 'faible',
    checks: {}
  });
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    if (checks.length) score += 1;
    if (checks.uppercase) score += 1;
    if (checks.lowercase) score += 1;
    if (checks.number) score += 1;
    if (checks.special) score += 2;
    if (password.length >= 12) score += 2;
    
    let strength = 'faible';
    if (score >= 6) strength = 'fort';
    else if (score >= 4) strength = 'moyen';
    
    setPasswordStrength({ score, strength, checks });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'password') {
      validatePassword(value);
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors([]);
    setLoading(true);

    try {
      await register(formData);
      navigate('/events');
    } catch (err) {
      if (err.message.includes('details')) {
        try {
          const data = JSON.parse(err.message);
          if (data.details && Array.isArray(data.details)) {
            setErrors(data.details);
          } else {
            setError(data.error || 'Erreur d\'inscription');
          }
        } catch {
          setError(err.message || 'Erreur d\'inscription');
        }
      } else {
        setError(err.message || 'Erreur d\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength.strength) {
      case 'faible': return '#dc3545';
      case 'moyen': return '#ffc107';
      case 'fort': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Inscription</h2>
      
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          borderRadius: '4px'
        }}>
          <strong>Erreur:</strong> {error}
        </div>
      )}

      {errors.length > 0 && (
        <div style={{ 
          color: '#856404',
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#fff3cd',
          borderRadius: '4px'
        }}>
          <strong>Problèmes à corriger:</strong>
          <ul style={{ margin: '5px 0 0 20px' }}>
            {errors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ 
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '0.9rem'
      }}>
        <h4 style={{ marginTop: 0 }}>Règles du mot de passe:</h4>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Au moins 8 caractères (12+ recommandé)</li>
          <li>Au moins une majuscule (A-Z)</li>
          <li>Au moins une minuscule (a-z)</li>
          <li>Au moins un chiffre (0-9)</li>
          <li>Au moins un caractère spécial (!@#$% etc.)</li>
          <li>Éviter les mots de passe communs</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="exemple@email.com"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Mot de passe *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Votre mot de passe sécurisé"
            style={{ width: '100%', padding: '8px' }}
          />
          
          {/* Indicateur de force du mot de passe */}
          {formData.password && (
            <div style={{ marginTop: '5px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: '0.9rem'
              }}>
                <span>Force: </span>
                <span style={{ 
                  marginLeft: '5px',
                  fontWeight: 'bold',
                  color: getPasswordStrengthColor()
                }}>
                  {passwordStrength.strength.toUpperCase()}
                </span>
                <div style={{ 
                  flex: 1,
                  marginLeft: '10px',
                  height: '5px',
                  backgroundColor: '#e9ecef',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(passwordStrength.score / 8) * 100}%`,
                    height: '100%',
                    backgroundColor: getPasswordStrengthColor(),
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
              
              {/* Détails des critères */}
              <div style={{ 
                marginTop: '10px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '5px',
                fontSize: '0.8rem'
              }}>
                <div style={{ color: passwordStrength.checks.length ? '#28a745' : '#dc3545' }}>
                  ✓ 8+ caractères
                </div>
                <div style={{ color: passwordStrength.checks.uppercase ? '#28a745' : '#dc3545' }}>
                  ✓ Majuscule
                </div>
                <div style={{ color: passwordStrength.checks.lowercase ? '#28a745' : '#dc3545' }}>
                  ✓ Minuscule
                </div>
                <div style={{ color: passwordStrength.checks.number ? '#28a745' : '#dc3545' }}>
                  ✓ Chiffre
                </div>
                <div style={{ color: passwordStrength.checks.special ? '#28a745' : '#dc3545' }}>
                  ✓ Spécial
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Prénom (optionnel)</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Votre prénom"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Nom (optionnel)</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Votre nom"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || (formData.password && passwordStrength.strength === 'faible')}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: passwordStrength.strength === 'faible' && formData.password ? '#6c757d' : '#28a745',
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: loading || (formData.password && passwordStrength.strength === 'faible') ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </button>
        
        {formData.password && passwordStrength.strength === 'faible' && (
          <p style={{ 
            color: '#dc3545', 
            fontSize: '0.8rem',
            marginTop: '10px',
            textAlign: 'center'
          }}>
            ⚠️ Améliorez votre mot de passe avant de vous inscrire
          </p>
        )}
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link to="/login">Déjà un compte ? Se connecter</Link>
      </div>
    </div>
  );
};

export default Register;