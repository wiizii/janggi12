package btt.janggi12.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class Game {

    @Id
    @GeneratedValue
    @Column(name="game_id")
    private Long id;

    @Column(name="log_url")
    private String logUrl;

    private String rPlayer;

    private String gPlayer;

    @Column(name="created_at")
    private LocalDateTime createdAt;
}
