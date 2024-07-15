package com.example.city_tours.service;

import com.example.city_tours.entity.Tour;
import com.example.city_tours.entity.TourLocation;
import com.example.city_tours.entity.TourTime;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.repository.TourLocationRepository;
import com.example.city_tours.repository.TourRepository;
import com.example.city_tours.repository.TourTimeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@AllArgsConstructor
public class TourLocationServiceImpl implements TourLocationService{

    private final TourRepository tourRepository;
    private final TourLocationRepository tourLocationRepository;

    @Transactional
    @Override
    public void deleteTourLocation(Long tourLocationId) {

        Optional<TourLocation> optionalTourLocation = tourLocationRepository.findById(tourLocationId);

        if (!optionalTourLocation.isPresent()) {
            throw new ResourceNotFoundException("Tour location not found");
        }

        TourLocation tourLocation = optionalTourLocation.get();

        Tour tour = tourLocation.getTour();

        if (tour != null) {
            tour.getTourLocations().remove(tourLocation);
            tourRepository.save(tour);
        }

        tourLocationRepository.delete(tourLocation);

    }

}
