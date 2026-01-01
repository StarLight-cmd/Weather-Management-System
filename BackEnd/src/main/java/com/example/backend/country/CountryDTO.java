package com.example.backend.country;

public class CountryDTO {
    private String code;
    private String policeNo;
    private String firedepNo;
    private String ambulanceNo;

    public CountryDTO() {}

    public CountryDTO(String code, String policeNo, String firedepNo, String ambulanceNo) {
        this.code = code;
        this.policeNo = policeNo;
        this.firedepNo = firedepNo;
        this.ambulanceNo = ambulanceNo;
    }

    // Getters and setters
    public String getCountryCode() { return code; }
    public void setCountryCode(String code) { this.code = code; }
    public String getPoliceNo() { return policeNo; }
    public void setPoliceNo(String policeNo) { this.policeNo = policeNo; }
    public String getFiredepNo() { return firedepNo; }
    public void setFiredepNo(String firedepNo) { this.firedepNo = firedepNo; }
    public String getAmbulanceNo() { return ambulanceNo; }
    public void setAmbulanceNo(String ambulanceNo) { this.ambulanceNo = ambulanceNo; }
}
