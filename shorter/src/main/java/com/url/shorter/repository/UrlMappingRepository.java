package com.url.shorter.repository;

import com.url.shorter.models.UrlMapping;
import com.url.shorter.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping,Long> {
    UrlMapping findByShortUrl(String shortUrl);
    List<UrlMapping> findByUser(User user);
}
