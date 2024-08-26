import React, { useState, useEffect } from "react";  
import "./ParticipantGender.css";  
import { useNavigate } from "react-router-dom";  
import axios from "axios";  

function ParticipantGender() {  
  const [genders, setGenders] = useState([]);  
  const [newGender, setNewGender] = useState("");  
  const navigate = useNavigate();  

  // API'den mevcut cinsiyet verilerini çekiyoruz  
  useEffect(() => {  
    const fetchGenders = async () => {  
      try {  
        const response = await axios.get("https://localhost:7282/User_GenderDTO");  
        setGenders(response.data);  
        console.log("Gender get", response.data);  
      } catch (error) {  
        console.error("Cinsiyet verileri çekilirken hata oluştu:", error);  
      }  
    };  

    fetchGenders();  
  }, []);  

  // Yeni cinsiyet ekleme fonksiyonu  
  const addGender = async () => {  
    if (newGender.trim()) {  
      try {  
        const response = await axios.post("https://localhost:7282/User_GenderDTO", {  
          name: newGender.trim(),  
        });  
        setGenders([...genders, response.data]);  
        setNewGender("");  
      } catch (error) {  
        console.error("Yeni cinsiyet eklenirken hata oluştu:", error);  
      }  
    }  
  };  

  // Cinsiyet silme fonksiyonu  
  const deleteGender = async (g_ID) => {  
    try {  
      await axios.delete(`https://localhost:7282/User_GenderDTO/${g_ID}`);  
      setGenders(genders.filter((gender) => gender.g_ID !== g_ID));  
    } catch (error) {  
      console.error("Cinsiyet silinirken hata oluştu:", error);  
    }  
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
          className="logo"  
          alt="ESBAŞ Logo"  
        />  
      </header>  
      <h2>KATILIMCI CİNSİYET</h2>  
      <ul className="gender-list">  
        {genders.map((gender, index) => (  
          <li key={index} className="gender-item">  
            {index + 1}. {gender.name}  
            <button  
              onClick={() => deleteGender(gender.g_ID, index)}  
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
          value={newGender}  
          onChange={(e) => setNewGender(e.target.value)}  
          placeholder="Yeni Cinsiyeti Yazınız"  
          className="input-field"  
        />  
        <button onClick={addGender} className="add-button">  
          +Yeni Cinsiyeti Ekle  
        </button>  
      </div>  
      <button className="save-button" onClick={() => navigate(-1)}>  
        GERİ DÖN  
      </button>  
    </div>  
  );  
}  

export default ParticipantGender;