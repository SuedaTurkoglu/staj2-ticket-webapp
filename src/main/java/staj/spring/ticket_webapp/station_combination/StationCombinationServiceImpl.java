package staj.spring.ticket_webapp.station_combination;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import staj.spring.ticket_webapp.base.OffsetBasedPageRequest;
import staj.spring.ticket_webapp.exception.LogicException;

import java.util.*;

@Service
@RequiredArgsConstructor
public class StationCombinationServiceImpl implements StationCombinationService{
    private final StationCombinationRepository stationCombinationRepository;
    private final StationCombinationMapper stationCombinationMapper;

    @Override
    public Page<StationCombinationDTO> getAllStationCombinations(Pageable pageable) {
        return stationCombinationRepository.findAll(pageable).map(stationCombinationMapper::stationCombinationToStationCombinationDto);
    }

    @Override
    public Page<StationCombinationDTO> getAllStationCombinations(Integer first, Integer last) {
        return stationCombinationRepository.findAll(OffsetBasedPageRequest.createPageable(first, last)).map(stationCombinationMapper::stationCombinationToStationCombinationDto);
    }

    @Override
    public StationCombinationDTO getStationCombinationById(Long id) {
        return stationCombinationRepository.findById(id)
                .map(stationCombinationMapper::stationCombinationToStationCombinationDto)
                .orElseThrow(() -> new EntityNotFoundException("Station Combination not found with id: " + id));
    }

    @Override
    public StationCombinationDTO createStationCombination(StationCombinationDTO stationCombinationDTO) {
        List<Long> stationsInOrder = checkSaveInOrder(stationCombinationDTO.getStationAId(), stationCombinationDTO.getStationBId());

        StationCombinationDTO created = StationCombinationDTO.builder()
                .stationAId(stationsInOrder.get(0))
                .stationBId(stationsInOrder.get(1))
                .distance(stationCombinationDTO.getDistance())
                .duration(stationCombinationDTO.getDuration()).build();
        StationCombination saved = stationCombinationRepository.save(stationCombinationMapper.stationCombinationDtoToStationCombination(created));

        return stationCombinationMapper.stationCombinationToStationCombinationDto(saved);
    }

    private List<Long> checkSaveInOrder(Long aId, Long bId){
        checkIdValid(aId, bId);

        List<Long> inOrder = new ArrayList<>(List.of(aId, bId));
        Collections.sort(inOrder); //station_a_id < station_b_id when saving in db

        return inOrder;
    }

    private void checkIdValid(Long aId, Long bId) {
        if ((aId <= 0) || (bId <= 0) || (aId.equals(bId) || aId == null || bId == null))
            throw new LogicException("Enter valid ids for combination");
    }

    @Override
    public StationCombinationDTO updateStationCombination(Long id, StationCombinationDTO stationCombinationDTO) {
        StationCombinationDTO existing = getStationCombinationById(id);
        if (!Objects.equals(existing.getStationAId(), stationCombinationDTO.getStationAId()) ||
                !Objects.equals(existing.getStationBId(), stationCombinationDTO.getStationBId())) //checks if the updated combination matches
            throw new LogicException("Stations of the combination cannot be updated. Delete this combination entity if needed and create the new one.");

        stationCombinationRepository.save(stationCombinationMapper.stationCombinationDtoToStationCombination(stationCombinationDTO));

        return getStationCombinationById(id);
    }

    @Override
    public void deleteStationCombination(Long id) {
        if (stationCombinationRepository.existsById(id))
            stationCombinationRepository.deleteById(id);
        else
            throw new EntityNotFoundException("Station Combination does not exist with id: " + id);
    }

    @Override
    public Integer getDistanceBetween(Long stationAId, Long stationBId){
        checkIdValid(stationAId, stationBId);

        if (stationAId < stationBId)
            return stationCombinationRepository.findByStationAIdAndStationBId(stationAId, stationBId).getDistance();
        return stationCombinationRepository.findByStationAIdAndStationBId(stationBId, stationAId).getDistance();
    }

    @Override
    public Integer getDurationBetween(Long stationAId, Long stationBId){
        checkIdValid(stationAId, stationBId);

        if (stationAId < stationBId)
            return stationCombinationRepository.findByStationAIdAndStationBId(stationAId, stationBId).getDuration();
        return stationCombinationRepository.findByStationAIdAndStationBId(stationBId, stationAId).getDuration();
    }
}
