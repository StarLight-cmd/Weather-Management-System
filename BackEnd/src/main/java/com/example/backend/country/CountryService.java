package com.example.backend.country;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CountryService {

    @Autowired
    private CountryRepository countryRepository;

    // dto to entity -> Controller
    public List<CountryDTO> getAllCountries() {
        return countryRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<CountryDTO> getCountryByCode(String code) {
        return countryRepository.findById(code).map(this::toDTO);
    }

    public CountryDTO createCountry(Country country) {
        return toDTO(countryRepository.save(country));
    }

    public Optional<CountryDTO> updateCountry(String code, Country country) {
        return countryRepository.findById(code).map(existing -> {
            existing.setPoliceNo(country.getPoliceNo());
            existing.setFiredepNo(country.getFiredepNo());
            existing.setAmbulanceNo(country.getAmbulanceNo());
            return toDTO(countryRepository.save(existing));
        });
    }

    public void deleteCountry(String code) {
        countryRepository.deleteById(code);
    }

    public CountryDTO toDTO(Country country) {
        return new CountryDTO(country.getCountryCode(), country.getPoliceNo(),
                country.getFiredepNo(), country.getAmbulanceNo());
    }

    public Country toEntity(CountryDTO dto) {
        Country country = new Country();
        country.setCountryCode(dto.getCountryCode());
        country.setPoliceNo(dto.getPoliceNo());
        country.setFiredepNo(dto.getFiredepNo());
        country.setAmbulanceNo(dto.getAmbulanceNo());
        return country;
    }
}
