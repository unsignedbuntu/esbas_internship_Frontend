import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddNewParticipant.css";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const AddNewParticipant = () => {
  const [RegID, setRegID] = useState("");
  const [cardID, setCardID] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [mailAddress, setMailAddress] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  const [userGender, setUserGender] = useState([]);
  const [mainCharacteristicts, setMainCharacteristicts] = useState([]);
  const [otherCharacteristicts, setOtherCharacteristicts] = useState([]);
  const [department, setDepartment] = useState([]);

  const [selectedUserGender, setSelectedUserGender] = useState("");
  const [selectedMainCharacteristicts, setSelectedMainCharacteristicts] = useState("");
  const [selectedOtherCharacteristicts, setSelectedOtherCharacteristicts] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  
  const navigate = useNavigate();
  const { eventID } = useParams();

  useEffect(() => {
    const fetchNormalizationTables = async () => {
      try {
        const userGenderResponse = await axios.get('https://localhost:7282/User_GenderDTO');
        const mainCharacteristictsResponse = await axios.get('https://localhost:7282/MainCharacteristictsDTO');
        const otherCharacteristictsResponse = await axios.get('https://localhost:7282/OtherCharacteristictsDTO');
        const departmentResponse = await axios.get('https://localhost:7282/DepartmentDTO');

        setUserGender(userGenderResponse.data);
        setMainCharacteristicts(mainCharacteristictsResponse.data);
        setOtherCharacteristicts(otherCharacteristictsResponse.data);
        setDepartment(departmentResponse.data);
      } catch (error) {
        console.error("Error fetching normalization tables", error);
      }
    };

    fetchNormalizationTables();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      userRegistrationID: RegID,
      cardID: cardID,
      fullName: fullName,
      dateOfBirth: dateOfBirth,
      mailAddress: mailAddress,
      hireDate: hireDate,
      phoneNumber: phoneNumber,
      departmentID: selectedDepartment,
      g_ID: selectedUserGender,
      mC_ID: selectedMainCharacteristicts,
      oC_ID: selectedOtherCharacteristicts
    };

    try {
      const userResponse = await axios.post('https://localhost:7282/UsersDTO', newUser);
      const cardID = userResponse.data.cardID;
      await axios.post('https://localhost:7282/Events_UsersDTO', { eventID: parseInt(eventID), cardID });

      navigate(`/plist/${eventID}`);
      console.log("Katılımcı başarıyla eklendi");
    } catch (error) {
      console.error('Katılımcı eklenirken hata oluştu:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({
      ...event,
      [name]: value
    });
  };


  const handleIconClick = (path) => {
    navigate(path);
  };

  return (
    <div className="add-participant-container">
      <header className="header">
        <img
          src={`${process.env.PUBLIC_URL}/logo-esbas.png`}
          onClick={() => navigate("/")}
          className="logo"
          alt="ESBAŞ Logo"
        />
      </header>
      <div className="add-participant">
        <h2>Yeni Katılımcı Ekle</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Sicil Numarası:
            <input
              type="text"
              name="userRegistrationID"
              value={RegID}
              onChange={(e) => setRegID(e.target.value)}
              required
            />
          </label>
          <label>
            Kart ID:
            <input
              type="text"
              name="cardID"
              value={cardID}
              onChange={(e) => setCardID(e.target.value)}
              required
            />
          </label>
          <label>
            Ad Soyad:
            <input
              type="text"
              name="fullName"
              value={fullName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Doğum Tarihi:
            <input
              type="date"
              name="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </label>
          <label>
            E-posta Adresi:
            <input
              type="email"
              name="mailAddress"
              value={mailAddress}
              onChange={(e) => setMailAddress(e.target.value)}
              required
            />
          </label>
          <label>
            İşe Alım Tarihi:
            <input
              type="date"
              name="hireDate"
              value={hireDate}
              onChange={(e) => setHireDate(e.target.value)}
              required
            />
          </label>
          <label>
            Telefon Numarası:
            <input
              type="tel"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </label>

          <div className="form-group">
            <label>
              Cinsiyet
              <FontAwesomeIcon
                icon={faCog}
                onClick={() => handleIconClick('/add-new-participant/participant-gender')}
                className="icon"
              />
            </label>
            <select
              value={selectedUserGender}
              onChange={(e) => setSelectedUserGender(e.target.value)}
            >
              <option value="">Seçiniz</option>
              {userGender.map((gender) => (
                <option key={gender.g_ID} value={gender.g_ID}>
                  {gender.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Ana Özellikler
              <FontAwesomeIcon
                icon={faCog}
                onClick={() => handleIconClick('/add-new-participant/participant-maincharacteristicts')}
                className="icon"
              />
            </label>
            <select
              value={selectedMainCharacteristicts}
              onChange={(e) => setSelectedMainCharacteristicts(e.target.value)}
            >
              <option value="">Seçiniz</option>
              {mainCharacteristicts.map((characteristicts) => (
                <option key={characteristicts.mC_ID} value={characteristicts.mC_ID}>
                  {characteristicts.characteristictsName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Diğer Özellikler
              <FontAwesomeIcon
                icon={faCog}
                onClick={() => handleIconClick('/add-new-participant/participant-othercharacteristicts')}
                className="icon"
              />
            </label>
            <select
              value={selectedOtherCharacteristicts}
              onChange={(e) => setSelectedOtherCharacteristicts(e.target.value)}
            >
              <option value="">Seçiniz</option>
              {otherCharacteristicts.map((characteristic) => (
                <option key={characteristic.oC_ID} value={characteristic.oC_ID}>
                  {characteristic.educationalStatus}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Departman
              <FontAwesomeIcon
                icon={faCog}
                onClick={() => handleIconClick('/add-new-participant/department')}
                className="icon"
              />
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">Seçiniz</option>
              {department.map((dept) => (
                <option key={dept.departmentID} value={dept.departmentID}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Kaydet</button>
        </form>
      </div>
    </div>
  );
};

export default AddNewParticipant;
