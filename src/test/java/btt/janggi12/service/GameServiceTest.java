package btt.janggi12.service;

import btt.janggi12.domain.Game;
import btt.janggi12.repository.GameRepository;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
class GameServiceTest {

    @Autowired GameService gameService;
    @Autowired GameRepository gameRepository;

    @Test
    public void saveGame() {
        //given
        Game game = createGame("test_url", "player1", "player2");

        //when
        Long savedId = gameService.saveGame(game);

        //then
        assertEquals(game, gameRepository.findOne(savedId));
    }

    @Test
    public void findGames() {
        //given
        Game game1 = createGame("test1", "1", "2");
        Game game2 = createGame("test2", "1", "3");
        Game game3 = createGame("test2", "4", "2");

        //when
        gameService.saveGame(game1);
        gameService.saveGame(game2);
        gameService.saveGame(game3);
        List<Game> games = new ArrayList<>();
        games.add(game1);
        games.add(game2);

        //then
        assertEquals(games, gameService.findGames("1"));
    }

    private Game createGame(String logUrl, String rPlayer, String gPlayer) {
        Game game = new Game();
        game.setLogUrl(logUrl);
        game.setRPlayer(rPlayer);
        game.setGPlayer(gPlayer);
        game.setCreatedAt(LocalDateTime.now());
        return game;
    }
}