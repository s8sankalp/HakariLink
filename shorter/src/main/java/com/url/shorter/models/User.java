package com.url.shorter.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name= "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generate the values
    private Long id;
    private String email;
    private String username;
    private String password;
    private String role="ROLE_USER";

}
