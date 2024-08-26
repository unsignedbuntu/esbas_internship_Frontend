import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ParticipantMainCharacteristicts.css";

function ParticipantMainCharacteristics() {
  const navigate = useNavigate();
  
  const [characteristics, setCharacteristics] = useState([]);
  const [newCharacteristic, setNewCharacteristic] = useState({
    workingMethod: "",
    isOfficeEmployee: "",
    typeOfHazard: ""
  });

  useEffect(() => {
    // Fetch existing characteristics from the backend when the component loads
    axios
      .get("https://localhost:7282/MainCharacteristicsDTO")
      .then((response) => setCharacteristics(response.data))
      .catch((error) => console.error("Error fetching characteristics:", error));
  }, []);

  const addCharacteristic = () => {
    if (
      newCharacteristic.workingMethod.trim() &&
      newCharacteristic.isOfficeEmployee.trim() &&
      newCharacteristic.typeOfHazard.trim()
    ) {
      // Send POST request to add new characteristic
      axios
        .post("https://localhost:7282/MainCharacteristicsDTO", {
          workingMethod: newCharacteristic.workingMethod.trim(),
          isOfficeEmployee: newCharacteristic.isOfficeEmployee.trim(),
          typeOfHazard: newCharacteristic.typeOfHazard.trim()
        })
        .then((response) => {
          setCharacteristics([...characteristics, response.data]);
          setNewCharacteristic({
            workingMethod: "",
            isOfficeEmployee: "",
            typeOfHazard: ""
          });
        })
        .catch((error) => console.error("Error adding characteristic:", error));
    }
  };

  const deleteCharacteristic = (mC_ID, index) => {
    // Send DELETE request to remove characteristic
    axios
      .delete(`https://localhost:7282/MainCharacteristicsDTO/${mC_ID}`)
      .then(() => {
        setCharacteristics(characteristics.filter((_, i) => i !== index));
      })
      .catch((error) => console.error("Error deleting characteristic:", error));
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="container">
      <header className="header">
        <img
          src={`${process.env.PUBLIC_URL}/logo-esbas.png`}
          onClick={handleLogoClick}
          alt="ESBAŞ Logo"
          className="logo"
        />
      </header>
      <h2>KATILIMCI ANA ÖZELLİKLERİ</h2>

      <ul className="main-list">
        {characteristics.map((characteristic, index) => (
          <li key={index} className="main-item">
            {index + 1}. {characteristic.workingMethod} - {characteristic.isOfficeEmployee} - {characteristic.typeOfHazard}
            <button
              onClick={() => deleteCharacteristic(characteristic.mC_ID, index)}
              className="delete-button"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      <div className="input-container">
        <input
          type="text"
          value={newCharacteristic.workingMethod}
          onChange={(e) => setNewCharacteristic({
            ...newCharacteristic,
            workingMethod: e.target.value
          })}
          placeholder="Çalışma Yöntemi"
          className="input-field"
        />
        <input
          type="text"
          value={newCharacteristic.isOfficeEmployee}
          onChange={(e) => setNewCharacteristic({
            ...newCharacteristic,
            isOfficeEmployee: e.target.value
          })}
          placeholder="Çalışma Alanı?"
          className="input-field"
        />
        <input
          type="text"
          value={newCharacteristic.typeOfHazard}
          onChange={(e) => setNewCharacteristic({
            ...newCharacteristic,
            typeOfHazard: e.target.value
          })}
          placeholder="Tehlike Türü"
          className="input-field"
        />
        <button onClick={addCharacteristic} className="add-button">
          + Yeni Özellik Ekle
        </button>
      </div>

      <button onClick={() => navigate(-1)} className="save-button">
        KAYDET
      </button>
    </div>
  );
}

export default ParticipantMainCharacteristics;
