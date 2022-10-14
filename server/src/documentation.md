# Server APIs

---

##### BASE ADDRESS : http://localhost:8000/api

### General APIs

**Base API Path:** /

1. **Get Department Event**
   **API Path :** /dept-event
   **API Method :** GET

    > REQUEST BODY &nbsp;&nbsp;:
    > { }

    > RESPONSE BODY :
    > { departmentEvents, success } - OK reponse
    > { error, message, success } - ERROR response

    ***

2. **Get Event**
   **API Path :** /event
   **API Method :** POST

    > REQUEST BODY &nbsp;&nbsp;:
    > { deptEventId (string) }

    > RESPONSE BODY :
    > { events, success } - OK reponse
    > { error, message, success } - ERROR response

    ***

3. **Get Department Coordinator**
   **API Path :** /dept-coordie
   **API Method :** POST

    > REQUEST BODY &nbsp;&nbsp;:
    > { deptEventId (string) }

    > RESPONSE BODY :
    > { deptEventCoordies, success } - OK reponse
    > { error, message, success } - ERROR response

    ***

4. **Get Event Coordinator**
   **API Path :** /event-coordie
   **API Method :** POST

    > REQUEST BODY &nbsp;&nbsp;:
    > { eventId (string) }

    > RESPONSE BODY :
    > { eventCoordies, success } - OK reponse
    > { error, message, success } - ERROR response

---

### Authentication APIs

**Base API Path :** /auth

1. **User Signup**
   **API Path :** /signup
   **API Method :** POST

    > REQUEST BODY &nbsp;&nbsp;:
    > { name (string), email (string), collegeName (string), gender ({"Male", "Female", "None"}), mobile (string) }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

    ***

2. **User Signin**
   **API Path :** /signin
   **API Method :** POST

    > REQUEST BODY &nbsp;&nbsp;:
    > { email (string), password (string) }

    > RESPONSE BODY :
    > { message, token, success } - OK response
    > { error, message, success } - ERROR response

    ***

3. **User Password Reset**
   **API Path :** /reset-password
   **API Method :** POST

    > REQUEST BODY &nbsp;&nbsp;:
    > { token (string), password (string) }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

---

### User APIs

**Base API Path :** /user

1. **Get User Own Details**
   **API Path :** /
   **API Method :** GET

    > REQUEST BODY &nbsp;&nbsp;:
    > { }

    > RESPONSE BODY :
    > { details, success } - OK response
    > { error, message, success } - ERROR response

    ***

2. **Update User Own Details**
   **API Path :** /
   **API Method :** PUT

    > REQUEST BODY &nbsp;&nbsp;:
    > { name (string), username (string), collegeName (string), resumeLink (string), mobile (string) }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

    ***

3. **Create New Team**
   **API Path :** /team
   **API Method :** POST
   **API Extras :** user creating the team automatically becomes the leader of the team

    > REQUEST BODY &nbsp;&nbsp;:
    > { }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

    ***

4. **Delete A Team**
   **API Path :** /team
   **API Method :** DELETE
   **API Extras :** only the leader can delete the team; all the participation of team get removed; all the members of the team get removed

    > REQUEST BODY &nbsp;&nbsp;:
    > { teamId (int) }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

    ***

5. **Send Invite To User**
   **API Path :** /team-invite
   **API Method :** POST
   **API Extras :** only team leader can send invite; team shouldn't be part of any event

    > REQUEST BODY &nbsp;&nbsp;:
    > { teamId (int), username (string) }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

    ***

6. **Respond To Team Invite**
   **API Path :** /team-invite
   **API Method :** PUT
   **API Extras :** request gets deleted in case the user declines the request

    > REQUEST BODY &nbsp;&nbsp;:
    > { teamId (int), status ({ "DECLINED", "ACCEPTED" }) }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

    ***

7. **Participate In Event**
   **API Path :** /participate
   **API Method :** POST
   **API Extras :** only team leader can participate in event; team shouldn't have any pending invite

    > REQUEST BODY &nbsp;&nbsp;:
    > { teamId (int), eventId (string) }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

    ***

8. **Unparticipate In Event**
   **API Path :** /participate
   **API Method :** DELETE
   **API Extras :** only team leader can unparticipate in any event

    > REQUEST BODY &nbsp;&nbsp;:
    > { teamId (int), eventId (string) }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

---

### Admin APIs

**Base API Path :** /admin

1. **Create Department Event**
   **API Path :** /dept-event
   **API Method :** POST
   **API Extras :** only super admin can create them

    > REQUEST BODY &nbsp;&nbsp;:
    > { name (string), organizer (string) }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

    ***

2. **Delete Department Event**
   **API Path :** /dept-event
   **API Method :** DELETE
   **API Extras :** only super admin can delete them

    > REQUEST BODY &nbsp;&nbsp;:
    > { id }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

    ***

3. **Create Department Coordinator**
   **API Path :** /dept-coordie
   **API Method :** POST
   **API Extras :** only super admin can create them

    > REQUEST BODY &nbsp;&nbsp;:
    > { userId (string), deptEventId (string) }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

    ***

4. **Delete Department Coordinator**
   **API Path :** /dept-coordie
   **API Method :** DELETE
   **API Extras :** only super admin can delete them

    > REQUEST BODY &nbsp;&nbsp;:
    > { userId (string), deptEventId (string) }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

    ***

5. **Create Event**
   **API Path :** /event
   **API Method :** POST
   **API Extras :** only department coordinator can create event

    > REQUEST BODY &nbsp;&nbsp;:
    > { name (string), tagline (string), details (string), criteria (string), rules (string), psLink (string), maxTeamSize (number), minTeamSize (number), deptEventId (string) }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

    ***

6. **Delete Event**
   **API Path :** /event
   **API Method :** DELETE
   **API Extras :** only department coordinator can delete event

    > REQUEST BODY &nbsp;&nbsp;:
    > { id (string) }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR

    ***

7. **Create Event Coordinator**
   **API Path :** /event-coordie
   **API Method :** POST
   **API Extras :** only department coordinator can create them

    > REQUEST BODY &nbsp;&nbsp;:
    > { userId (string), eventId (string) }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

    ***

8. **Delete Department Coordinator**
   **API Path :** /event-coordie
   **API Method :** DELETE
   **API Extras :** only department coordinator can delete them

    > REQUEST BODY &nbsp;&nbsp;:
    > { userId (string), eventId (string) }

    > RESPONSE BODY :
    > { message, success } - OK response
    > { error, message, success } - ERROR response

---