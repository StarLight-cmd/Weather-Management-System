package com.example.backend.shelter;

import com.example.backend.country.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shelters")
public class ShelterController {

    @Autowired
    private ShelterRepository shelterRepository;

    @Autowired
    private CountryRepository countryRepository;

    @GetMapping
    public List<Shelter> getAllShelters() {
        return shelterRepository.findAll();
    }

    @PostMapping
    public Shelter createShelter(@RequestBody Shelter shelter) {
        return shelterRepository.save(shelter);
    }

    @GetMapping("/{id}")
    public Shelter getShelterById(@PathVariable Long id) {
        return shelterRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Shelter updateShelter(@PathVariable Long id, @RequestBody Shelter updatedShelter) {
        return shelterRepository.findById(id).map(shelter -> {
            shelter.setShelterLat(updatedShelter.getShelterLat());
            shelter.setShelterLon(updatedShelter.getShelterLon());
            shelter.setName(updatedShelter.getName());
            shelter.setPhoneNo(updatedShelter.getPhoneNo());
            shelter.setAddress(updatedShelter.getAddress());
            shelter.setCountry(updatedShelter.getCountry());
            return shelterRepository.save(shelter);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteShelter(@PathVariable Long id) {
        shelterRepository.deleteById(id);
    }
}
