package btt.janggi12.service;

import btt.janggi12.domain.Player;
import btt.janggi12.repository.PlayerRepository;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
class PlayerServiceTest {

    @Autowired PlayerService playerService;
    @Autowired PlayerRepository playerRepository;

    @Test
    void join() {
        //given
        Player player = new Player();
        player.setName("test");

        //when
        Long savedId = playerService.join(player);

        //then
        assertEquals(player, playerRepository.findOne(savedId));
    }

    @Test
    void join_exception(){
        //given
        Player player1 = new Player();
        player1.setName("test");
        playerService.join(player1);

        Player player2 = new Player();
        player2.setName("test");

        //when
        try{
            playerService.join(player2);
        }catch(IllegalStateException e){
             return;
        }

        //then
        fail("회원 닉네임 중복 예외 발생");
    }

    @Test
    void findPlayers() {
        //given
        Player player1 = new Player();
        player1.setName("test1");
        Player player2 = new Player();
        player2.setName("test2");
        Player player3 = new Player();
        player3.setName("test3");
        playerService.join(player1);
        playerService.join(player2);
        playerService.join(player3);
        List<Player> players = new ArrayList<>();
        players.add(player1);
        players.add(player2);
        players.add(player3);

        //when
        List<Player> getPlayers = playerService.findPlayers();

        //then
        assertEquals(players, getPlayers);
    }

    @Test
    void findOne() {
        //given
        Player player = new Player();
        player.setName("test");
        Long savedId = playerService.join(player);

        //when
        Player getPlayer = playerService.findOne(savedId);

        //then
        assertEquals(player, getPlayer);
    }
}