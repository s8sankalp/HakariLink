package com.url.shorter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.url.shorter.models.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long>
{
    Optional<User> findByUsername(String username);
}
