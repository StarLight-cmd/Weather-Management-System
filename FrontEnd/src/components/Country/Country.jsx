import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Country.css';
import Banner from '../Banner/Banner';
import search from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/assets/search.gif';

const Country = () => {

    const navigate = useNavigate();

    const [code, setCode] = useState('');
    const [country, setCountry] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const fetchCountry = async () => {
        try {
            const res = await axios.get(`http://localhost:9090/countries/${code}`);
            setCountry(res.data);
            setEditMode(false);
        } catch (err) {
            alert('Country not found');
            setCountry(null);
        }
    };

    const updateCountry = async () => {
        try {
            await axios.put(`http://localhost:9090/countries/${code}`, country);
            alert('Country updated');
            setEditMode(false);
        } catch (err) {
            alert('Update failed');
        }
    };

    const deleteCountry = async () => {
        try {
            await axios.delete(`http://localhost:9090/countries/${code}`);
            alert('Country deleted');
            setCountry(null);
        } catch (err) {
            alert('Delete failed');
        }
    };

    return (
        <><Banner />
            <div className="country-container">
                <img src="/logo.png" alt="Logo" className="country-logo" />
                <span className='title'>Country Details</span>
                <br />
                <div className="country-search-bar">
                    <input
                        type="text"
                        placeholder="Enter Country Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <img src={search} alt="Search" onClick={fetchCountry} />
                </div>

                {country && (
                    <div className="country-data">
                        <div className="country-row">
                            <strong>Police:</strong>
                            {editMode ? (
                                <input
                                    value={country.policeNo}
                                    onChange={(e) =>
                                        setCountry({ ...country, policeNo: e.target.value })
                                    }
                                />
                            ) : (
                                <span>{country.policeNo}</span>
                            )}
                        </div>
                        <div className="country-row">
                            <strong>Fire Dept:</strong>
                            {editMode ? (
                                <input
                                    value={country.firedepNo}
                                    onChange={(e) =>
                                        setCountry({ ...country, firedepNo: e.target.value })
                                    }
                                />
                            ) : (
                                <span>{country.firedepNo}</span>
                            )}
                        </div>
                        <div className="country-row">
                            <strong>Ambulance:</strong>
                            {editMode ? (
                                <input
                                    value={country.ambulanceNo}
                                    onChange={(e) =>
                                        setCountry({ ...country, ambulanceNo: e.target.value })
                                    }
                                />
                            ) : (
                                <span>{country.ambulanceNo}</span>
                            )}
                        </div>
                    </div>
                )}

                {country && (
                    <div style={{ marginTop: '20px' }}>
                        {!editMode ? (
                            <button onClick={() => setEditMode(true)}>Edit</button>
                        ) : (
                            <button onClick={updateCountry}>Save</button>
                        )}
                        <button onClick={deleteCountry} style={{ marginLeft: '10px' }}>
                            Delete
                        </button>
                    </div>
                )}

            </div>
        </>
    );

};

export default Country;
