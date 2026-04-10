package com.url.shorter.services;

import com.url.shorter.dtos.ClickEventDTO;
import com.url.shorter.dtos.UrlMappingDTO;
import com.url.shorter.models.ClickEvent;
import com.url.shorter.models.UrlMapping;
import com.url.shorter.models.User;
import com.url.shorter.repository.ClickEventRepository;
import com.url.shorter.repository.UrlMappingRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class UrlMappingService {
    private ClickEventRepository clickEventRepository;
    private UrlMappingRepository urlMappingRepository;
    public UrlMappingDTO createShortUrl(String originalUrl, User user)
    {
String shortURl=generateShortUrl();
        UrlMapping urlMapping=new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortURl);
        urlMapping.setUser(user);
        urlMapping.setCreatedDate(LocalDateTime.now());
        UrlMapping savedUrlMapping =urlMappingRepository.save(urlMapping);
        return convertToDto(savedUrlMapping);
    }
    private UrlMappingDTO convertToDto(UrlMapping urlMapping)
    {
        UrlMappingDTO urlMappingDTO=new UrlMappingDTO();
        urlMappingDTO.setId(urlMapping.getId());
        urlMappingDTO.setOriginalUrl(urlMapping.getOriginalUrl());
        urlMappingDTO.setShortUrl(urlMapping.getShortUrl());
        urlMappingDTO.setClickCount(urlMapping.getClickCount());
        urlMappingDTO.setCreatedDate(urlMapping.getCreatedDate());
        urlMappingDTO.setUsername(urlMapping.getUser().getUsername());
        return urlMappingDTO;
    }
    public String generateShortUrl(){
        String characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random=new Random();
        StringBuilder shortUrl=new StringBuilder(6);
        for(int i=0;i<6;i++)
        {
            shortUrl.append(characters.charAt(random.nextInt(characters.length())));
        }
        return shortUrl.toString();
    }
    public List<UrlMappingDTO> getUrlsByUser(User user)
    {
        return urlMappingRepository.findByUser(user).stream()
                .map(this::convertToDto)
                .toList();
    }
    public List<ClickEventDTO> getClickEventsByDate(String shortUrl,LocalDateTime start,LocalDateTime end)
    {
        UrlMapping urlMapping=urlMappingRepository.findByShortUrl(shortUrl);
        if(urlMapping!=null)
        {
            return clickEventRepository.findByUrlMappingAndClickDateBetween(urlMapping,start,end).stream()
                    .collect(Collectors.groupingBy(click->click.getClickDate().toLocalDate(),Collectors.counting()))
                    . entrySet().stream()
                    .map(entry->{
                        ClickEventDTO clickEventDTO=new ClickEventDTO();
                        clickEventDTO.setClickDate(entry.getKey());
                        clickEventDTO.setCount(entry.getValue());
                        return clickEventDTO;
                    })
                    .collect(Collectors.toList());


        }
        return null;
    }

    public Map<LocalDate, Long> getTotalClicksByUserAndDate(User user, LocalDate start, LocalDate end) {
        List<UrlMapping> urlMappings= urlMappingRepository.findByUser(user);
        List<ClickEvent> clickEvents=clickEventRepository.findByUrlMappingInAndClickDateBetween(urlMappings,start.atStartOfDay(),end.plusDays(1).atStartOfDay());
        return clickEvents.stream()
                .collect(Collectors.groupingBy(click->click.getClickDate().toLocalDate(),Collectors.counting()));
    }
}
