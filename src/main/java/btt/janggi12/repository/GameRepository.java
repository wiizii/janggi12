package btt.janggi12.repository;

import btt.janggi12.domain.Game;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class GameRepository {

    private final EntityManager em;

    public void save(Game game){
        em.persist(game);
    }

    public Game findOne(Long id){
         return em.find(Game.class, id);
    }

    public List<Game> findAll(String name){
        return em.createQuery("select g from Game g where g.rPlayer = :name or g.gPlayer = :name", Game.class)
                .setParameter("name", name)
                .getResultList();
    }
}
