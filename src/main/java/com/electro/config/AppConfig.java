package com.electro.config;

import org.glassfish.jersey.server.ResourceConfig;

public class AppConfig extends ResourceConfig {
    public AppConfig(){
        packages("com.electro.controller");
        packages("com.electro.middleware");
        register(org.glassfish.jersey.media.multipart.MultiPartFeature.class);
    }
}
