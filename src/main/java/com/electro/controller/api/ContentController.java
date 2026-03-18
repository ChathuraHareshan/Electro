package com.electro.controller.api;

import com.electro.service.ContentService;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/content")
public class ContentController {

    @Path("/colorStorage")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadCities() {
        String responseJson = new ContentService().loadAllColorStorage();
        return Response.ok().entity(responseJson).build();
    }

}
