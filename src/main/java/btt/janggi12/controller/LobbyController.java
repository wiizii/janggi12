package btt.janggi12.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class LobbyController {

    @RequestMapping("/")
    public String home(){
        return "home";
    }

    @RequestMapping("/single")
    public String single(){
        return "single";
    }

    @RequestMapping("/rule")
    public String rule(){
        return "rule";
    }

}
