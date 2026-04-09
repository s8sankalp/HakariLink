package com.url.shorter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.url.shorter.models.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User,Long>
{
    Optional<User> findByUsername(String username);
}
