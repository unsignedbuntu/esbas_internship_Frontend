import React, { useState, useEffect } from "react";
import "./Department.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Department() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('https://localhost:7282/DepartmentDTO');
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments", error);
      }
    };

    fetchDepartments();
  }, []);

  const addDepartment = async () => {
    if (newDepartment.trim()) {
      try {
        const response = await axios.post('https://localhost:7282/DepartmentDTO', {
          name: newDepartment.trim()
        });
        setDepartments([...departments, response.data]);
        setNewDepartment("");
      } catch (error) {
        console.error("Error adding department", error);
      }
    }
  };

  const deleteDepartment = async (departmentID) => {
    try {
      await axios.delete(`https://localhost:7282/DepartmentDTO/${departmentID}`);
      setDepartments(departments.filter((department) => department.departmentID !== departmentID));
    } catch (error) {
      console.error("Error deleting department", error);
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
          alt="ESBAŞ Logo"
          className="logo"
        />
      </header>
      <h2>KATILIMCI DEPARTMAN</h2>
      <ul className="department-list">
        {departments.map((department) => (
          <li key={department.departmentID} className="department-item">
            {department.name}
            <button
              onClick={() => deleteDepartment(department.departmentID)}
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
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          placeholder="Yeni Departmanı Yazınız"
          className="input-field"
        />
        <button onClick={addDepartment} className="add-button">
          +
        </button>
      </div>
      <button className="save-button">KAYDET</button>
    </div>
  );
}

export default Department;
