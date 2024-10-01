package com.radar;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@WebServlet("/api/search")
    public class SearchServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Set response content type to JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Parse the request body to get the compliance ID
        String complianceId = new Gson().fromJson(request.getReader(), Map.class).get("complianceId").toString();

        // Replace this block with your actual logic for fetching the logs
        // For now, we will return some mock data
        Map<String, Object> result = new HashMap<>();
        result.put("actions", getDummyActionsLogs(complianceId));
        result.put("analysis", getDummyAnalysisLogs(complianceId));

        // Convert the result to JSON and write it back to the response
        PrintWriter out = response.getWriter();
        String jsonResponse = new Gson().toJson(result);
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        out.print(jsonResponse);
        out.flush();
    }

    // Dummy data for Actions logs
    private List<Map<String, Object>> getDummyActionsLogs(String complianceId) {
        List<Map<String, Object>> logs = new ArrayList<>();

        // Example log 1
        Map<String, Object> log1 = new HashMap<>();
        log1.put("system", "System A");
        log1.put("date", "12/09/2024 13:45:01");
        log1.put("summary", "This is Summary 1");
        log1.put("log", "green");

        // Detailed table with key-value pairs
        Map<String, String> details1 = new HashMap<>();
        details1.put("Key 1", "Value 1");
        details1.put("Key 2", "Value 2");
        log1.put("details", details1);
        logs.add(log1);

        // Example log 2
        Map<String, Object> log2 = new HashMap<>();
        log2.put("system", "System B");
        log2.put("date", "12/09/2024 13:50:05");
        log2.put("summary", "This is Summary 2");
        log2.put("log", "red");

        Map<String, String> details2 = new HashMap<>();
        details2.put("Key A", "Value A");
        details2.put("Key B", "Value B");
        log2.put("details", details2);
        logs.add(log2);

        return logs;
    }

    // Dummy data for Analysis logs
    private List<Map<String, Object>> getDummyAnalysisLogs(String complianceId) {
        List<Map<String, Object>> logs = new ArrayList<>();

        // Example log 1
        Map<String, Object> log1 = new HashMap<>();
        log1.put("system", "System C");
        log1.put("date", "12/09/2024 14:00:15");
        log1.put("summary", "This is Summary 3");
        log1.put("log", "yellow");

        Map<String, String> details1 = new HashMap<>();
        details1.put("Key X", "Value X");
        details1.put("Key Y", "Value Y");
        log1.put("details", details1);
        logs.add(log1);

        // Example log 2
        Map<String, Object> log2 = new HashMap<>();
        log2.put("system", "System D");
        log2.put("date", "12/09/2024 14:05:20");
        log2.put("summary", "This is Summary 4");
        log2.put("log", "blue");

        Map<String, String> details2 = new HashMap<>();
        details2.put("Key M", "Value M");
        details2.put("Key N", "Value N");
        log2.put("details", details2);
        logs.add(log2);

        return logs;
    }
}
