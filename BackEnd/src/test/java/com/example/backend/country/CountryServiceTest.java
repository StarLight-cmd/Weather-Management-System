package com.example.backend.country;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CountryServiceTest {

    @Mock
    private CountryRepository countryRepository;

    @InjectMocks
    private CountryService countryService;

    private Country country;
    private CountryDTO countryDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        this.country = new Country();
        this.country.setCountryCode("ZA");
        this.country.setPoliceNo("10111");
        this.country.setFiredepNo("10177");
        this.country.setAmbulanceNo("10177");

        this.countryDTO = new CountryDTO("ZA", "10111", "10177", "112");
    }

    // Get countries tests
    @Test
    void testGetAllCountries_Returns_all_countries() {
        when(countryRepository.findAll()).thenReturn(Arrays.asList(country));
        assertEquals(1, countryService.getAllCountries().size());
        verify(countryRepository, times(1)).findAll();
    }

    @Test
    void testGetCountryByCode_Returns_countryCode() {
        //test name must be as discriptive as possible methodundertest_with-inputs_shouldreturn-outputs
        when(countryRepository.findById("ZA")).thenReturn(Optional.of(country));
        Optional<CountryDTO> result = countryService.getCountryByCode("ZA");
        assertTrue(result.isPresent());
        assertEquals("ZA", result.get().getCountryCode());
    }

    // Create country tests
    @Test
    void testCreateCountry_CountryInfo_Returns_countryEntity() {
        when(countryRepository.save(any(Country.class))).thenReturn(country);
        CountryDTO result = countryService.createCountry(country);
        assertEquals("ZA", result.getCountryCode());
    }

    // Update country tests
    @Test
    void testUpdateCountry_countryinfo_Returns_modifiedCountryEntity() {
        when(countryRepository.findById("ZA")).thenReturn(Optional.of(country));
        when(countryRepository.save(any(Country.class))).thenReturn(country);
        Optional<CountryDTO> result = countryService.updateCountry("ZA", country);
        assertTrue(result.isPresent());
        assertEquals("ZA", result.get().getCountryCode());
    }

    // Delete country tests
    @Test
    void testDeleteCountry_countryId() {
        doNothing().when(countryRepository).deleteById("ZA");
        countryService.deleteCountry("ZA");
        verify(countryRepository, times(1)).deleteById("ZA");
    }
}
