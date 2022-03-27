package com.Active.kalam.model;

import java.util.ArrayList;

public class ChatMessage {
    private String content;
    private String sender;
    private int id;
    private MessageType type;
    private ArrayList<User> users;

    public enum MessageType {
        CHAT, LEAVE, JOIN
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getId(){
        return id;
    }

    public void setId(int id){
        this.id= id;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public ArrayList<User> getUsers(){
        return users;
    }

    public void setUsers(ArrayList<User> users){
        this.users = users;
    }


}
