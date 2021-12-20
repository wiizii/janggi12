package btt.janggi12.domain;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class Player {

    @Id
    @GeneratedValue
    @Column(name = "player_id")
    private Long id;

    private String name;

    @ColumnDefault("0")
    private Long total;

    @ColumnDefault("0")
    private Long win;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
