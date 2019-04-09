package vn.ssdc.vnpt.erp.core;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.interceptor.SimpleKeyGenerator;
import org.springframework.stereotype.Component;

@Component
public class CacheService {
    private static final Logger logger = LoggerFactory.getLogger(CacheService.class);
    private CacheManager cacheManager;

    @Autowired
    public void setCacheManager(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    public void evict(String cache, Object... params) {
        Object key = SimpleKeyGenerator.generateKey(params);
        this.cacheManager.getCache(cache).evict(key);
    }

    public void put(String cache, Object value, Object... params) {
        Object key = SimpleKeyGenerator.generateKey(params);
        this.cacheManager.getCache(cache).put(key,value);
    }

    public void clear(String cache) {
        this.cacheManager.getCache(cache).clear();
    }

    public Object get(String cache,Object... params) {
        Object key = SimpleKeyGenerator.generateKey(params);
        return this.cacheManager.getCache(cache).get(key);
    }
}
