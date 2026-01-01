package com.example.backend.shelter;

import com.example.backend.country.Country;
import jakarta.persistence.*;

@Entity
public class Shelter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double shelterLat;
    private double shelterLon;

    private String name;
    private String phoneNo;
    private String address;

    @ManyToOne
    @JoinColumn(name = "country_code", nullable = false)
    private Country country;

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public double getShelterLat() { return shelterLat; }
    public void setShelterLat(double shelterLat) { this.shelterLat = shelterLat; }

    public double getShelterLon() { return shelterLon; }
    public void setShelterLon(double shelterLon) { this.shelterLon = shelterLon; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhoneNo() { return phoneNo; }
    public void setPhoneNo(String phoneNo) { this.phoneNo = phoneNo; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Country getCountry() { return country; }
    public void setCountry(Country country) { this.country = country; }
}
