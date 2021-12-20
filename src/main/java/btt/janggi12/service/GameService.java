package btt.janggi12.service;

import btt.janggi12.domain.Game;
import btt.janggi12.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;

    @Transactional
    public Long saveGame(Game game){
        gameRepository.save(game);
        return game.getId();
    }

    public List<Game> findGames(String name){
        return gameRepository.findAll(name);
    }

}
