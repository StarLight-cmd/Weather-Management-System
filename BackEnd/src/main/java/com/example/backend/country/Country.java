package com.example.backend.country;

import jakarta.persistence.*;

@Entity
public class Country {

    @Id
    private String countryCode;

    private String policeNo;
    private String firedepNo;
    private String ambulanceNo;

    // Getters and Setters
    public String getCountryCode() { return countryCode; }

    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public String getPoliceNo() { return policeNo; }

    public void setPoliceNo(String policeNo) { this.policeNo = policeNo; }

    public String getFiredepNo() { return firedepNo; }

    public void setFiredepNo(String firedepNo) { this.firedepNo = firedepNo; }

    public String getAmbulanceNo() { return ambulanceNo; }

    public void setAmbulanceNo(String ambulanceNo) { this.ambulanceNo = ambulanceNo; }
}
