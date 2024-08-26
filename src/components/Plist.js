import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import "./PList.css";  // Update to match the actual file name
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { CheckboxSelectionComponent } from 'ag-grid-community';
import 'ag-grid-enterprise';

function Plist() {
    const [datas, setDatas] = useState([]);
    const [filteredData, setFilteredDatas] = useState([]);
    const [error, setError] = useState(null);
    const { EventID } = useParams();

    // Ref'ler ile gridApi ve columnApi'yi saklıyoruz
    const gridApi = useRef(null);
    const columnApi = useRef(null);

    const transformData = (datas) => {
        return datas.map(user => ({
            cardID: user.cardID,
            fullName: user.fullName,
            dateOfBirth: user.dateOfBirth,
            mailAddress: user.mailAddress,
            userRegistrationID: user.userRegistrationID,
            hireDate: user.hireDate,
            phoneNumber: user.phoneNumber,
            gender: user.user_Gender?.name || 'Unknown',
            workingMethod: user.main_Characteristicts?.workingMethod || 'Unknown',
            isOfficeEmployee: user.main_Characteristicts?.isOfficeEmployee || 'Unknown',
            typeOfHazard: user.main_Characteristicts?.typeOfHazard || 'Unknown',
            educationalStatus: user.other_Characteristicts?.educationalStatus || 'Unknown',
            departmentName: user.department?.name || 'Unknown',
            tasksName : user.department?.tasks?.name || 'Unknown',
            costcentersName : user.department?.costCenters?.name || 'Unknown',
            budget : user.department?.costCenters?.budget || 'Unknown',
 
        }));
    };

    useEffect(() => {
        const fetchData = async () => {

            try {
                console.log("EventID", EventID);

                if (EventID) {
                    const response = await axios.get(`https://localhost:7282/Events_UsersDTO/${EventID}`);

                    setDatas(transformData(response.data.user));
                    setFilteredDatas(response.data.user);
                    console.log("Response data:", response.data);

                    console.log("Filtered data:", filteredData);
                }
            } catch (err) {
                setError(err);
                console.error('Error fetching data:', err);
            }
            //console.log("Datas:" ,datas);
        };
        fetchData();
    }, [EventID]);

    // Rest of the code remains the same  


    const columns = [
        { headerName: "Ad Soyad", field: "fullName", checkboxSelection:true },
        { headerName: "Doğum Tarihi", field: "dateOfBirth" },
        { headerName: "Email Adresi", field: "mailAddress" },
        { headerName: "Personel Sicil No", field: "userRegistrationID" },
        { headerName: "İşe Giriş Tarihi", field: "hireDate" },
        { headerName: "Telefon Numarası", field: "phoneNumber" },
        { headerName: "Cinsiyet", field: "gender" },
        { headerName: "Ana-Çalışma Şekli", field: "workingMethod" },
        { headerName: "Ana-Çalışma Alanı", field: "isOfficeEmployee" },
        { headerName: "Ana-Tehlike Türü", field: "typeOfHazard" },
        { headerName: "Diğer-Eğitim Durumu", field: "educationalStatus" },
        { headerName: "Departman", field: "departmentName" },
        { headerName: "Görev", field: "tasksName" },
        { headerName: "Masraf Merkezi İsmi", field: "costcentersName" },
        { headerName: "Masraf Merkezi Bütçesi", field: "budget" },
    ];
    // console.log("Columns:", columns); 

    const tableRows = [];
    console.log("Datas:", datas);
    datas.forEach(EventUsers => {

        tableRows.push(
            <tr key={EventUsers.cardID}>
                <td>{EventUsers.fullName}</td>
                <td>{EventUsers.dateOfBirth}</td>
                <td>{EventUsers.mailAddress}</td>
                <td>{EventUsers.userRegistrationID}</td>
                <td>{EventUsers.hireDate}</td>
                <td>{EventUsers.phoneNumber}</td>
                <td>{EventUsers.gender}</td>
                <td>{EventUsers.workingMethod}</td>
                <td>{EventUsers.isOfficeEmployee}</td>
                <td>{EventUsers.typeOfHazard}</td>
                <td>{EventUsers.educationalStatus}</td>
                <td>{EventUsers.departmentName}</td>
                 <td>{EventUsers.tasksName}</td>  
                 <td>{EventUsers.costcentersName}</td> 
                 <td>{EventUsers.budget}</td> 

            </tr>

        );
    });




    const defaultColDef = {
        sortable: true,
        editable: false,  // Varsayılan olarak düzenlenemez
        filter: true,
        floatingFilter: true,
        flex: 1 // Flex özelliği ile sütun genişliği dinamik olabilir
    };


    const onGridReady = params => {
        gridApi.current = params.api;
        columnApi.current = params.columnApi;
    };


    const onExportClick = () => {
        if (gridApi.current) {
            // Grid'deki tüm verileri alın
            const allData = [];
            gridApi.current.forEachNode((node) => allData.push(node.data));

            // XLSX formatına çevirin
            const worksheet = XLSX.utils.json_to_sheet(allData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

            // Excel dosyasını indirin
            XLSX.writeFile(workbook, 'exported_data.xlsx');
        }
    };

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>React-App</h1>
            <button onClick={onExportClick}>Export to CSV</button>
            <div id="myGrid" className="ag-theme-alpine grid-container">
                <AgGridReact
                    rowData={datas}  // Filtrelenmiş veriyi göster
                    columnDefs={columns}    // Sütunları doğru isimlendirin
                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}
                    rowSelection='multiple'
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10,20,30]}
                />
            </div>
        </div>
    );
}

export default Plist;