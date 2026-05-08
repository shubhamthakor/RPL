import React, { useState, useEffect } from 'react';
import './RegistrationForm.css';
import logo from './assets/logo.png'; 

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    address: '',
    team: '',
    mobile: '',
    category: '',
    role: '',
    battingPosition: '',
    battingPlaying: '',
    bowlingStyle: '', // Added this new field
    termsAccepted: false
  });

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeSplash(true), 2500); 
    const hideTimer = setTimeout(() => setShowSplash(false), 3000); 
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const { name, fatherName, address, team, mobile, category, role, termsAccepted, battingPosition, battingPlaying, bowlingStyle } = formData;
    
    // Basic Validation
    if (!name || !fatherName || !address || !team || !mobile || !category || !role || !termsAccepted) {
      setErrorMessage('Please fill in all the details and accept the rules.');
      return;
    }

    if (mobile.length !== 10 || isNaN(mobile)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Role-specific Validation
    if (role === 'batsman' && (!battingPosition || !battingPlaying)) {
      setErrorMessage('Please select your batting position and playing order.');
      return;
    }
    
    if (role === 'bowler' && !bowlingStyle) {
      setErrorMessage('Please select your bowling style.');
      return;
    }

    if (role === 'allrounder' && (!battingPosition || !battingPlaying || !bowlingStyle)) {
      setErrorMessage('Please fill in all batting and bowling details for the all-rounder role.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccessMessage('Registration Successful!');
        setFormData({ name: '', fatherName: '', address: '', team: '', mobile: '', category: '', role: '', battingPosition: '', battingPlaying: '', bowlingStyle: '', termsAccepted: false });
      } else {
        setErrorMessage('Failed to submit form. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Server error. Ensure your backend is running.');
    }
  };

  if (showSplash) {
    return (
      <div className={`splash-screen ${fadeSplash ? 'fade-out' : ''}`}>
        <img src={logo} alt="RPL Logo" className="splash-logo" />
      </div>
    );
  }

  return (
    <div className="form-container">
      <header className="form-header">
        <img src={logo} alt="Logo Left" className="header-logo" />
        <h1>Rajputwada Premier League</h1>
        <img src={logo} alt="Logo Right" className="header-logo" />
      </header>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="rpl-form">
        <div className="input-group">
          <label>1. Enter Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Full Name" />
        </div>

        <div className="input-group">
          <label>2. Enter Father Name</label>
          <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Father's Name" />
        </div>

        <div className="input-group">
          <label>3. Enter Address</label>
          <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Full Address"></textarea>
        </div>

        <div className="input-group">
          <label>4. Select Team</label>
          <select name="team" value={formData.team} onChange={handleChange}>
            <option value="">-- Select Team --</option>
            <option value="Limdo Warriors">Limdo Warriors</option>
            <option value="pipdo banka gang">Pipdo Banka Gang</option>
          </select>
        </div>

        <div className="input-group">
          <label>5. Enter Mobile Number</label>
          <input type="tel" name="mobile" maxLength="10" value={formData.mobile} onChange={handleChange} placeholder="10-digit number" />
        </div>

        <div className="input-group">
          <label>6. Category</label>
          <div className="radio-group">
            <label><input type="radio" name="category" value="under 19" onChange={handleChange} checked={formData.category === 'under 19'} /> Under 19</label>
            <label><input type="radio" name="category" value="under 23" onChange={handleChange} checked={formData.category === 'under 23'} /> Under 23</label>
            <label><input type="radio" name="category" value="senior" onChange={handleChange} checked={formData.category === 'senior'} /> Senior</label>
          </div>
        </div>

        <div className="input-group">
          <label>7. Select Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="">-- Select Role --</option>
            <option value="batsman">Batsman</option>
            <option value="bowler">Bowler</option>
            <option value="wicket keeper">Wicket Keeper</option>
            {/* Fixed the value here to be "allrounder" instead of "wicket keeper" */}
            <option value="allrounder">All rounder</option>
          </select>
        </div>

        {/* Shows if Batsman OR All rounder is selected */}
        {(formData.role === 'batsman' || formData.role === 'allrounder') && (
          <div className="conditional-fields">
            <div className="input-group">
              <label>BATTING POSITION</label>
              <div className="radio-group">
                <label><input type="radio" name="battingPosition" value="right handed" onChange={handleChange} checked={formData.battingPosition === 'right handed'} /> Right Handed</label>
                <label><input type="radio" name="battingPosition" value="left handed" onChange={handleChange} checked={formData.battingPosition === 'left handed'} /> Left Handed</label>
              </div>
            </div>
            <div className="input-group">
              <label>PLAYING ORDER</label>
              <div className="radio-group">
                <label><input type="radio" name="battingPlaying" value="opener" onChange={handleChange} checked={formData.battingPlaying === 'opener'} /> Opener</label>
                <label><input type="radio" name="battingPlaying" value="one down" onChange={handleChange} checked={formData.battingPlaying === 'one down'} /> One Down</label>
                <label><input type="radio" name="battingPlaying" value="middle order" onChange={handleChange} checked={formData.battingPlaying === 'middle order'} /> Middle Order</label>
              </div>
            </div>
          </div>
        )}

        {/* Shows if Bowler OR All rounder is selected */}
        {(formData.role === 'bowler' || formData.role === 'allrounder') && (
          <div className="conditional-fields" style={{ marginTop: '10px' }}>
            <div className="input-group">
              <label>BOWLING STYLE</label>
              <div className="radio-group">
                <label><input type="radio" name="bowlingStyle" value="faster" onChange={handleChange} checked={formData.bowlingStyle === 'faster'} /> Faster</label>
                <label><input type="radio" name="bowlingStyle" value="spinner" onChange={handleChange} checked={formData.bowlingStyle === 'spinner'} /> Spinner</label>
              </div>
            </div>
          </div>
        )}

        <div className="rules-section">
          <h3>Rules and Regulations</h3>
          <ol>
            <li>એન્ટ્રી ફી :- ૨૦/- (પ્લેયર દીઠ)</li>
            <li>પ્લેયર કેપેસિટી = ૧૦/ટીમ</li>
            <li>અમ્પાયર ડિસિઝન ફાઇનલ</li>
            <li>બેટિંગ બોલિંગ માટે ટોસ ઉછાળવામાં આવશે</li>
            <li>૧૫ ઓવર ની મેચ</li>
            <li>એક પ્લેયર એ ત્રણ જ ઓવર નાખવી</li>
            <li>વ્હાઇટ નો ૧ રન</li>
            <li>ફાસ્ટ બોલિગ સ્વીકારવામાં આવશે નય</li>
            <li>ફાસ્ટ બોલિંગ = નો-બોલ</li>
            <li>નો-બોલ નો ૧ રન</li>
            <li>કોઈ પણ પ્લેયર રુલ્સ નું ભંગ કરશે તેને બ્લેકલિસ્ટ કરવામાં આવશે આવતી મેચ ઓ માં</li>
            <li>રેનિગ રાખવામાં આવશે</li>
            <li>છેલ્લા પ્લેયર થી રમાશે નય.. 9 વિકેટ પડે એટલે ટીમ ઓલઆઉટ</li>
            <li>ટપ્પી કેચ નોટ આઉટ</li>
            <li>પ્લાસ્ટિક નો બોલ રહેશે</li>
            <li>ફાઇનલ વિજેતા ટીમ ઇનામ ૩૫૦ (૨ ટીમ ની ટોટલ ફી=૪૦૦ જેમાંથી ૧ બોલ નુ પેકેટ લાવામાં આવશે ૪૦૦-૫૦ = ૩૫૦ = ફાઇનલ ઇનામ)</li>
            <li>મેચ પેહલા ફી ભરવી ફરજિયાત રહેશે</li>
            <li>ટીમ ના પ્લેયરઓ એ એકબીજા સાથે ડિસ્કસ કરીને ને ફોર્મ ભરવાનું રહેશે</li>
            <li>ઘર,ગેલેરી કે અગાસી માં બોલ જાય તો નોટ આઉટ </li>
            <li>ગ્રાઉન્ડ પીપળો (બદલાય શકે છે) </li>
          </ol>
          
          <div className="checkbox-group">
            <label>
              <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} />
              I have read these rules and I agree with this
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn">Final Submit</button>
      </form>

      <footer className="form-footer">
        <p>If any query then call <a href="tel:6354313082" className="call-link">6354313082 Shubham Thakor</a></p>
      </footer>
    </div>
  );
};

export default App;