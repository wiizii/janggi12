package btt.janggi12.repository;

import btt.janggi12.domain.Player;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class PlayerRepository {

    private final EntityManager em;

    public void save(Player player){
        em.persist(player);
    }

    public Player findOne(Long id){
        return em.find(Player.class, id);
    }

    public List<Player> findAll() {
        return em.createQuery("select p from Player p", Player.class)
                .getResultList();
    }

    public List<Player> findByName(String name){
        return em.createQuery("select p from Player p where p.name = :name", Player.class)
                .setParameter("name", name)
                .getResultList();
    }

}
