package btt.janggi12.service;

import btt.janggi12.domain.Player;
import btt.janggi12.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    @Transactional
    public Long join(Player player){
        validateDuplicatePlayer(player);
        playerRepository.save(player);
        return player.getId();
    }

    private void validateDuplicatePlayer(Player player) {
        List<Player> findPlayers = playerRepository.findByName(player.getName());
        if(!findPlayers.isEmpty()){
            throw new IllegalStateException("이미 존재하는 닉네임입니다.");
        }
    }

    public List<Player> findPlayers(){
        return playerRepository.findAll();
    }

    public Player findOne(Long playerId) {
        return playerRepository.findOne(playerId);
    }
}
