package com.electro.service;

import com.electro.entity.Category;
import com.electro.entity.Color;
import com.electro.entity.Storage;
import com.electro.util.AppUtil;
import com.electro.util.HibernateUtil;
import com.google.gson.JsonObject;
import org.hibernate.Session;

import java.util.List;

public class ContentService {
    public String loadAllColorStorage() {

        JsonObject resJsonObject = new JsonObject();

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        List<Color> colorList = hibernateSession.createQuery("from Color c", Color.class).getResultList();
        List<Storage> storageList = hibernateSession.createQuery("from Storage s", Storage.class).getResultList();
        List<Category> categoryList = hibernateSession.createQuery("from Category ca", Category.class).getResultList();

        resJsonObject.add("colors", AppUtil.GSON.toJsonTree(colorList));
        resJsonObject.add("storage", AppUtil.GSON.toJsonTree(storageList));
        resJsonObject.add("category", AppUtil.GSON.toJsonTree(categoryList));

        hibernateSession.close();

        return AppUtil.GSON.toJson(resJsonObject);


    }
}
