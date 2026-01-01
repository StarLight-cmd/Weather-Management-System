package com.example.backend.country;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/countries")
public class CountryController {

    @Autowired
    private CountryService countryService;

    @GetMapping
    public List<CountryDTO> getAllCountries() {
        return countryService.getAllCountries();
    }

    @PostMapping
    public ResponseEntity<CountryDTO> createCountry(@RequestBody CountryDTO countryDTO) {
        Country country = new Country();
        country.setCountryCode(countryDTO.getCountryCode());
        country.setPoliceNo(countryDTO.getPoliceNo());
        country.setFiredepNo(countryDTO.getFiredepNo());
        country.setAmbulanceNo(countryDTO.getAmbulanceNo());
        return ResponseEntity.ok(countryService.createCountry(country));
    }

    @GetMapping("/{code}")
    public ResponseEntity<CountryDTO> getCountryByCode(@PathVariable String code) {
        return countryService.getCountryByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{code}")
    public ResponseEntity<CountryDTO> updateCountry(@PathVariable String code, @RequestBody CountryDTO countryDTO) {
        Country country = new Country();
        country.setCountryCode(countryDTO.getCountryCode());
        country.setPoliceNo(countryDTO.getPoliceNo());
        country.setFiredepNo(countryDTO.getFiredepNo());
        country.setAmbulanceNo(countryDTO.getAmbulanceNo());

        return countryService.updateCountry(code, country)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteCountry(@PathVariable String code) {
        countryService.deleteCountry(code);
        return ResponseEntity.noContent().build();
    }
}
