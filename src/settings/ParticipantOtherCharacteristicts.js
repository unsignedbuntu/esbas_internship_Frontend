import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ParticipantOtherCharacteristicts.css";

function OtherCharacteristicts() {
  const navigate = useNavigate();

  const [characteristics, setCharacteristics] = useState([]);
  const [newCharacteristic, setNewCharacteristic] = useState("");

  useEffect(() => {
    axios
      .get("https://localhost:7282/OtherCharacteristictsDTO")
      .then((response) => setCharacteristics(response.data))
      .catch((error) => console.error("Error fetching characteristics:", error));
  }, []);

  const addCharacteristic = () => {
    if (newCharacteristic.trim()) {
      axios
        .post("https://localhost:7282/OtherCharacteristictsDTO", {
          educationalStatus: newCharacteristic.trim(),
        })
        .then((response) => {
          setCharacteristics([...characteristics, response.data]);
          setNewCharacteristic("");
        })
        .catch((error) => console.error("Error adding characteristic:", error));
    }
  };

  const deleteCharacteristic = (oC_ID, index) => {
    axios
      .delete(`https://localhost:7282/OtherCharacteristictsDTO/${oC_ID}`)
      .then(() => {
        setCharacteristics(characteristics.filter((_, i) => i !== index));
      })
      .catch((error) => console.error("Error deleting characteristic:", error));
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSaveClick = () => {
    console.log("Diğer özellikler kaydedildi");
    navigate(-1);
  };

  return (
    <div className="container">
      <header className="header">
        <img
          src={`${process.env.PUBLIC_URL}/logo-esbas.png`}
          onClick={handleLogoClick}
          className="logo"
          alt="ESBAŞ Logo"
        />
      </header>

      <h2>DİĞER ÖZELLİKLER</h2>

      <ul className="other-list">
        {characteristics.map((characteristic, index) => (
          <li key={index} className="other-item">
            <span>{index + 1} {characteristic.educationalStatus}</span>
            <button
              onClick={() => deleteCharacteristic(characteristic.oC_ID, index)}
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
          value={newCharacteristic}
          onChange={(e) => setNewCharacteristic(e.target.value)}
          placeholder="Yeni Özelliği Yazınız"
          className="input-field"
        />
        <button onClick={addCharacteristic} className="add-button">
          + Yeni Özellik Ekle
        </button>
      </div>

      <button onClick={handleSaveClick} className="save-button">
        KAYDET
      </button>
    </div>
  );
}

export default OtherCharacteristicts;
