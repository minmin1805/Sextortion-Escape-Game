# FRIEND OR FOE – Profile Content (Technical-Structure Aligned)

This document defines all profile content and red flags so they map 1:1 to the game’s flagging system.

---

## Technical structure reference

| Area | Flagging rule | elementKey shape | Red-flag count |
|------|----------------|------------------|----------------|
| **Profile photo** | Click profile photo to flag | `profilePhoto` | At most 1 per profile |
| **Username** | Click username to flag | `username` | At most 1 per profile |
| **Bio** | Click bio text to flag | `bio` | At most 1 per profile |
| **Location** | Click location to flag | `location` | At most 1 per profile |
| **Account age / Joined date** | Click joined date to flag | `joinedDate` | At most 1 per profile |
| **Friends count** | Click friends count to flag | `friends` | At most 1 per profile |
| **Followers count** | Click followers to flag | `followers` | At most 1 per profile |
| **Following count** | Click following to flag | `following` | At most 1 per profile |
| **Mutual friends** | Click mutual friends to flag | `mutualFriends` | At most 1 per profile |
| **Posts** | Click an individual post to flag it | `post_1`, `post_2`, … | One flag per post (each suspicious post = 1 flag) |
| **Friends section** | Click the whole Friends block (e.g. “See all friends”) to flag | `section_friends` | At most 1 per profile |
| **Photos section** | Click the whole Photo gallery to flag | `section_photos` | At most 1 per profile |

---

## Notebook / reminder system (how missed flags become tips)

The Friend or Foe game includes a **reference notebook popup** on every profile screen. This document defines how reminders in that notebook are generated from red flags and the player’s actions.

- For each profile, the data here lists its **red flags** as `elementKey`s (e.g. `joinedDate`, `bio`, `post_6`, `section_photos`).
- During play, the game tracks which `elementKey`s the player actually **flagged** on that profile.
- After the decision, we compute:
  - **Missed flags** = all red‑flag `elementKey`s for that profile **minus** the ones the player clicked.
- The notebook popup shows **one section per profile in the order the player has played them**, with:
  - A header like “Profile 1 – @cool_gamer_2847391”.
  - A list of short **reminder sentences** for each missed flag on that profile.
  - If the player did not miss any flags on that profile, that profile’s reminder list is empty.

Example mapping from `elementKey` to reminder sentence (the game implementation can use this table):

| elementKey        | Reminder sentence example |
|-------------------|---------------------------|
| `joinedDate`      | “Remember to check when the account was created (joined date).” |
| `bio`             | “Remember to read the bio carefully for red flags (like ‘DM open’ or money requests).” |
| `profilePhoto`    | “Remember to look closely at the profile photo (is it real, stock, or AI-generated?).” |
| `friends`         | “Remember to notice how many friends they have and whether that number makes sense.” |
| `followers`       | “Remember to check followers versus following – strange ratios can be a red flag.” |
| `following`       | “Remember to see how many accounts they are following compared to their followers.” |
| `mutualFriends`   | “Remember to check whether you share any mutual friends with this account.” |
| `section_photos`  | “Remember to review the photo gallery for real-life, consistent photos.” |
| `section_friends` | “Remember to look at who they are friends with, not just their posts.” |
| `post_…`          | “Remember to read recent posts carefully, not just the profile intro.” |

The rest of this document defines the **content and red flags** per profile. The notebook feature does **not** change the flags themselves – it only turns **missed** red flags into friendly reminders for that profile.

---

## PROFILE 1 – Obviously Fake (Easy)

- **Username:** @cool_gamer_2847391  
- **Display name:** Jessica  
- **Profile photo:** No photo (default avatar silhouette)  
- **Bio:** "Hey! I'm 14 and love gaming and music. Let's be friends!"  
- **Location:** Los Angeles, CA  
- **Account age:** Created 3 days ago  
- **Friends:** 12  
- **Followers:** 8  
- **Following:** 247  
- **Mutual friends:** 0  

**Posts (3 total):**

| ID     | Text                         | Date     | Image |
|--------|------------------------------|----------|-------|
| post_1 | "Just joined! Add me everyone!" | 3 days ago | No    |
| post_2 | "Who wants to chat?"         | 2 days ago | No    |
| post_3 | "Bored, DM me"               | 1 day ago  | No    |

**Photo gallery:** Empty  

**Friends section:** 12 friends (section exists; no “red flag” for this profile’s friends list content, but see red flags below).

---

### Red flags (7 total) – each maps to one elementKey

| # | elementKey     | Reason (short) |
|---|----------------|----------------|
| 1 | `profilePhoto` | No profile photo |
| 2 | `username`     | Generic username with random numbers |
| 3 | `joinedDate`   | Brand new account (3 days old) |
| 4 | `friends`      | Very few friends (12) |
| 5 | `mutualFriends`| No mutual friends |
| 6 | `following`    | Following 247 but only 8 followers (suspicious ratio) |
| 7 | `section_photos` | No photos in gallery (empty gallery) |

- **Correct decision:** REJECT  
- **Explanation if rejected (correct):** This profile has 7 major red flags: no profile photo, brand new account, no mutual friends, and a suspicious follower ratio. Predators often create profiles like this to quickly add many teens.  
- **Explanation if accepted (wrong):** This profile had 7 red flags you might have missed: no profile photo, very new account (3 days), no mutual friends, very few friends but following 247 people, no photos, and generic posts. Never accept requests from accounts with multiple red flags.

---

## PROFILE 2 – Stock Photo Fake (Easy–Medium)

- **Username:** @sarah_anderson_23  
- **Display name:** Sarah Anderson  
- **Profile photo:** Stock photo of smiling teenage girl (professional quality, too perfect)  
- **Bio:** "15 | Cheerleader | Love making new friends 💕 DM open!"  
- **Location:** Miami, FL  
- **Account age:** Created 2 weeks ago  
- **Friends:** 87  
- **Followers:** 45  
- **Following:** 312  
- **Mutual friends:** 1  

**Posts (5 total):**

| ID     | Text                          | Date      | Image |
|--------|-------------------------------|-----------|-------|
| post_1 | "Love the beach!"             | 2 weeks ago | Stock beach |
| post_2 | "Yum!"                        | 1 week ago  | Stock food |
| post_3 | "Be yourself"                 | 5 days ago  | Generic quote image |
| post_4 | "Beautiful sunset"            | 3 days ago  | Stock sunset |
| post_5 | "Who wants to chat? Bored!"   | 1 day ago   | No image |

**Photo gallery:** 4 stock photos (beach, sunset, food, flowers); all professional/stock quality; no personal photos.  

**Friends section:** 87 friends.

---

### Red flags (10 total) – each maps to one elementKey

| # | elementKey       | Reason (short) |
|---|------------------|----------------|
| 1 | `profilePhoto`   | Profile photo is a stock image (too perfect, professional) |
| 2 | `joinedDate`     | Very new account (2 weeks) |
| 3 | `mutualFriends`  | Only 1 mutual friend (weak connection) |
| 4 | `section_photos` | All photos are stock images; no personal content |
| 5 | `bio`            | Bio says "DM open" (inviting messages from strangers) |
| 6 | `post_1`         | Generic post; stock image, no personal content |
| 7 | `post_2`         | Generic post; stock image, no personal content |
| 8 | `post_3`         | Generic post; generic quote, no personal content |
| 9 | `post_4`         | Generic post; stock image, no personal content |
|10 | `post_5`         | Generic post; asks to chat / no personal content |

- **Correct decision:** REJECT  
- **Explanation if rejected (correct):** The profile photo is a stock image, the account is only 2 weeks old, and all the photos in the gallery are stock images with no personal content. Predators use stock photos to create fake profiles that look attractive and trustworthy.  
- **Explanation if accepted (wrong):** This account seemed okay at first but had 6+ red flags: stock photo profile picture, very new account (2 weeks), only 1 mutual friend, all posts use stock images, no personal photos, and bio invites DMs from strangers. Always investigate profile photos carefully.

---

## PROFILE 3 – Real Safe Account (Easy)

- **Username:** @alex_soccer_24  
- **Display name:** Alex Martinez  
- **Profile photo:** Casual selfie (age-appropriate, clearly authentic)  
- **Bio:** "16 | Soccer player | Lincoln High | Gaming enthusiast"  
- **Location:** Boston, MA  
- **Account age:** Created 2 years ago  
- **Friends:** 284  
- **Followers:** 312  
- **Following:** 267  
- **Mutual friends:** 8  

**Posts (8 recent):** Soccer game with friends, gaming setup, group photo at school, food photo, homework meme, etc.  

**Photo gallery:** 19+ photos – selfies, friends, sports, hobbies, family events; same person; natural teen content; same locations (home, school, field).  

**Friends section:** 284 friends; comments show consistent friend group and inside jokes.

---

### Red flags

None. This profile is safe.

### Green flags (for explanation only; not clickable flags)

- Real personal photo  
- Account 2 years old  
- Good friend/follower ratio  
- 8 mutual friends  
- Bio includes real details (school, interests)  
- Posts are personal and authentic  
- Same person in photos  
- Natural friend interactions in comments  

- **Correct decision:** ACCEPT (if you know them or have mutual friends)  
- **Explanation if accepted (correct):** This account shows signs of a real person: authentic personal photos, account that’s 2 years old, 8 mutual friends, consistent posts over time, and natural friend interactions. This is what a real teen profile looks like.  
- **Explanation if rejected (wrong):** This was actually a safe, real account. While it’s okay to be cautious, this profile had no red flags: real personal photos, established account (2 years), multiple mutual friends, authentic content, and natural friend interactions. Look for these green flags when evaluating real profiles.

---

## PROFILE 4 – Sophisticated Fake (Hard)

- **Username:** @emma_wilson_15  
- **Display name:** Emma Wilson  
- **Profile photo:** Attractive teen photo (could be real or stolen)  
- **Bio:** "15 | Love photography | Cat mom to Mr. Whiskers | Always looking for new friends!"  
- **Location:** Portland, OR  
- **Account age:** Created 3 months ago  
- **Friends:** 156  
- **Followers:** 89  
- **Following:** 423  
- **Mutual friends:** 2  

**Posts (8 total):**

| ID     | Text                                          | Date       | Image   |
|--------|-----------------------------------------------|------------|---------|
| post_1 | "Mr. Whiskers being cute"                     | 3 months ago | Cat photo |
| post_2 | "Pretty sky tonight"                          | 2 months ago | Sunset  |
| post_3 | "Dinner yum!"                                 | 2 months ago | Food    |
| post_4 | "New hair color!"                             | 1 month ago  | Selfie  |
| post_5 | "Reading this"                                | 3 weeks ago  | Book    |
| post_6 | "Anyone want to chat? Bored!"                 | 2 weeks ago  | No      |
| post_7 | "Looking for new friends to talk to!"         | 1 week ago   | No      |
| post_8 | "DM me if you want to talk about anything"    | 3 days ago   | No      |

**Photo gallery:** 8 photos – mix of generic content (cat, sunset, food, book); only 1 selfie; no friends in any photos; no location-specific content.  

**Friends section:** 156 friends.

---

### Red flags (12 total) – each maps to one elementKey

| # | elementKey       | Reason (short) |
|---|------------------|----------------|
| 1 | `following`      | Following 423 but only 89 followers (mass-adding) |
| 2 | `joinedDate`     | Account only 3 months old but trying hard to make friends |
| 3 | `mutualFriends`  | Only 2 mutual friends (weak connection) |
| 4 | `section_photos` | No friends appear in any photos; generic content only |
| 5 | `post_1`         | Generic post; no personal details |
| 6 | `post_2`         | Generic post; no personal details |
| 7 | `post_3`         | Generic post; no personal details |
| 8 | `post_4`         | Only one selfie in whole profile; no friends in photos |
| 9 | `post_5`         | Generic post; no personal details |
|10 | `post_6`         | Asks for DMs/chat (suspicious) |
|11 | `post_7`         | Asks for new friends to talk to (suspicious) |
|12 | `post_8`         | Invites DMs (suspicious) |

- **Correct decision:** REJECT  
- **Explanation if rejected (correct):** Sharp detective skills. While this profile looked more convincing, you spotted the red flags: following way more people than follow back, recent posts all asking for DMs, no friends in any photos, and generic content. Predators create "convincing" profiles to seem trustworthy.  
- **Explanation if accepted (wrong):** This was a tricky one. The profile seemed okay but had multiple red flags: following 423 people but only 89 followers (mass-adding), recent posts all ask for DMs/chats, no friends in photos, generic posts with no personal details, and a relatively new account. Be extra careful with accounts that seem too friendly or eager to chat.

---

## PROFILE 5 – Real Account (Medium)

- **Username:** @riley_art_creates  
- **Display name:** Riley Chen  
- **Profile photo:** Selfie with art supplies  
- **Bio:** "14 | Digital artist 🎨 | Commissions open | Boston Art Club | They/them"  
- **Location:** Boston, MA  
- **Account age:** Created 1 year ago  
- **Friends:** 198  
- **Followers:** 245  
- **Following:** 183  
- **Mutual friends:** 5  

**Posts (7+ recent):** Digital art, art process video, photo with art club members, pet photo, commission announcement, etc.  

**Photo gallery:** 10+ photos – artwork, art process, selfies with art, group photos with consistent friends, art club events.  

**Friends section:** 198 friends; natural comments on art and teen conversations.

---

### Red flags

None. This profile is safe.

### Green flags (for explanation only)

- Authentic personal photo  
- Account 1 year old  
- 5 mutual friends  
- Consistent theme (art)  
- Real friend interactions  
- More followers than following (people interested in their art)  
- Specific interests and community (art club)  
- Personal content over time  

- **Correct decision:** ACCEPT (if you share interests or have mutuals)  
- **Explanation if accepted (correct):** This is a real account with authentic content: 1 year old account, 5 mutual friends, consistent art theme, real friend interactions, and personal content over time. The follower/following ratio makes sense for someone who creates art content.  
- **Explanation if rejected (wrong):** This was actually a safe account. While caution is good, this profile showed authentic signs: established account, multiple mutual friends, consistent personal content (art), real friend interactions, and a logical reason for more followers (art content). Learn to recognize safe profiles too.

---

## PROFILE 6 – Predator Grooming Account (Hard)

- **Username:** @jason_lee_16  
- **Display name:** Jason Lee  
- **Profile photo:** Attractive teenage boy (likely stolen photo)  
- **Bio:** "16 | Basketball player | Chill vibes | Hit me up"  
- **Location:** Your city, [State]  
- **Account age:** Created 1 month ago  
- **Friends:** 203  
- **Followers:** 178  
- **Following:** 245  
- **Mutual friends:** 3  

**Posts (10 total):**

| ID      | Text                                    | Date      | Image      |
|---------|-----------------------------------------|-----------|------------|
| post_1  | "Game day"                              | 1 month ago | Basketball |
| post_2  | "New ride"                              | 3 weeks ago | Car        |
| post_3  | "Gains 💪"                              | 2 weeks ago | Gym selfie |
| post_4  | "Who's down to hang out?"               | 2 weeks ago | No         |
| post_5  | "Anyone want to video chat?"            | 10 days ago | No         |
| post_6  | "Looking for chill people to talk to"   | 1 week ago  | No         |
| post_7  | "Add me on Snapchat: jasonlee_snap"     | 5 days ago  | No         |
| post_8  | "Who wants to meet up?"                 | 3 days ago  | No         |
| post_9  | "DM me, I'm bored"                      | 2 days ago  | No         |
| post_10 | "Send me your Snap"                     | 1 day ago   | No         |

**Photo gallery:** 6 photos – could be stolen; generic poses (gym, car, basketball); no friends; no personal life shown.  

**Friends section:** 203 friends.

---

### Red flags (11 total) – each maps to one elementKey

| # | elementKey       | Reason (short) |
|---|------------------|----------------|
| 1 | `joinedDate`     | Account only 1 month old but already 203 friends (too quick) |
| 2 | `friends`        | 203 friends in 1 month (suspicious growth) |
| 3 | `bio`            | Bio says "hit me up" (too eager for contact) |
| 4 | `section_photos` | No friends appear in any photos |
| 5 | `post_4`         | Asks who wants to hang out (push for meet-up) |
| 6 | `post_5`         | Asks for video chat (push for private communication) |
| 7 | `post_6`         | Looking for people to talk to (eager to chat) |
| 8 | `post_7`         | Pushes for off-platform (Snapchat) |
| 9 | `post_8`         | Asks who wants to meet up (push for meet-up) |
|10 | `post_9`         | Asks for DMs (push for private messaging) |
|11 | `post_10`        | Asks for Snap (push for off-platform) |

- **Correct decision:** REJECT  
- **Explanation if rejected (correct):** This profile showed classic predator grooming tactics: new account that added 203 people in 1 month, posts asking to meet up or video chat, pushing for Snapchat (where messages disappear), no friends in photos, and escalating requests for private communication. Predators create profiles that look like attractive teens to gain trust.  
- **Explanation if accepted (wrong):** This was a predator account. Red flags you missed: account rapidly added 200+ friends in 1 month, multiple posts asking to chat/meet/video call, tried to move conversation to Snapchat, no real friends in photos, and increasingly pushy about private communication. Be very suspicious of accounts that seem too eager to connect privately.

---

## PROFILE 7 – Real Account with Minor Flags (Hard)

- **Username:** @jordan_music  
- **Display name:** Jordan Taylor  
- **Profile photo:** Mirror selfie (authentic teen)  
- **Bio:** "15 | Drummer 🥁 | Punk rock fan | New to the area, making friends"  
- **Location:** Seattle, WA  
- **Account age:** Created 2 months ago  
- **Friends:** 47  
- **Followers:** 52  
- **Following:** 68  
- **Mutual friends:** 1  

**Posts (15 total):** Drum kit, band poster, selfie first day new school, food, homework meme, drum practice video, photo with 2 teens "Made some friends!", concert ticket, selfie with friends, etc.  

**Photo gallery:** 18 photos – same person; drum kit appears multiple times; started alone, now has friends in recent photos; natural "new kid" progression.  

**Friends section:** 47 friends; new friends and band/music discussions in comments.

---

### Red flags

None. This profile is safe (context explains apparent red flags).

### Green flags / why it’s safe

- Authentic personal photos (same person throughout)  
- Consistent theme (drums, music, school)  
- Natural progression (alone → making friends over time)  
- Real comments from local teens  
- Reasonable friend count for someone new to the area  
- Good follower/following ratio (similar numbers)  
- Personal content (homework, cafeteria, school)  
- 1 mutual friend from new area  
- Bio explains "new to area, making friends"  

- **Correct decision:** ACCEPT (safe; just new to area)  
- **Explanation if accepted (correct):** Great judgment. While the account is only 2 months old and has fewer friends, that fits someone new to the area. The profile shows authentic personal photos, consistent drum/music theme, natural friend-making progression, and real interactions. New doesn’t always mean fake – look at the full context.  
- **Explanation if rejected (wrong):** This was actually a real, safe account. You might have been suspicious because it’s only 2 months old with 47 friends, but the bio explains they’re "new to the area." The profile shows authentic photos (same person), consistent interests (drums), natural progression (started alone, now has friends), and real comments. Context matters – new account + "just moved" = makes sense.

---

## PROFILE 8 – Obvious Scammer (Easy)

- **Username:** @miami_model_girl_18  
- **Display name:** Sophia ❤️  
- **Profile photo:** Professional model photo (glamorous, clearly not amateur)  
- **Bio:** "18 | Model | Miami 🌴 | Cash App: $sophiamodel | Tips appreciated 💰"  
- **Location:** Miami, FL  
- **Account age:** Created 1 week ago  
- **Friends:** 5  
- **Followers:** 3  
- **Following:** 189  
- **Mutual friends:** 0  

**Posts (4 total):**

| ID     | Text                                              | Date      | Image   |
|--------|---------------------------------------------------|-----------|---------|
| post_1 | "New photoshoot!"                                 | 1 week ago | Pro model |
| post_2 | "Feeling pretty 💕"                               | 5 days ago | Pro model |
| post_3 | "Need help with rent, Cash App in bio"            | 3 days ago | No      |
| post_4 | "Add me on Snapchat for exclusive content 😘"      | 1 day ago  | No      |

**Photo gallery:** 4 professional modeling photos; no casual/personal photos.  

**Friends section:** 5 friends.

---

### Red flags (9 total) – each maps to one elementKey

| # | elementKey       | Reason (short) |
|---|------------------|----------------|
| 1 | `profilePhoto`   | Professional model photo (not authentic teen content) |
| 2 | `joinedDate`    | Brand new account (1 week old) |
| 3 | `friends`       | Only 5 friends (extremely suspicious) |
| 4 | `mutualFriends` | No mutual friends |
| 5 | `following`     | Following 189 people (mass adding) |
| 6 | `bio`           | Cash App in bio (asking for money) |
| 7 | `section_photos`| All professional modeling photos; no personal content |
| 8 | `post_3`        | Post requests money/tips (Cash App) |
| 9 | `post_4`        | Pushes for Snapchat "exclusive content" |

- **Correct decision:** REJECT  
- **Explanation if rejected (correct):** This is clearly a scam account: professional model photos, brand new account (1 week), Cash App in bio requesting money, only 5 friends, and pushing for "exclusive content" on Snapchat. This is not a real teen – it’s likely a scammer or predator using stolen model photos.  
- **Explanation if accepted (wrong):** This was a dangerous scam account. Red flags: professional model photos (not real teen selfies), account only 1 week old, Cash App requesting money in bio, only 5 friends, posts asking for tips/money, and pushing Snapchat for "exclusive content." Never accept accounts that ask for money or have professional photos with very new accounts.

---

## PROFILE 9 – Real Athlete Account (Medium)

- **Username:** @taylor_track_star  
- **Display name:** Taylor Kim  
- **Profile photo:** Track uniform selfie at competition  
- **Bio:** "15 | Track & Field 🏃‍♀️ | 400m runner | Jefferson High | Personal best: 58.2s"  
- **Location:** Austin, TX  
- **Account age:** Created 8 months ago  
- **Friends:** 156  
- **Followers:** 189  
- **Following:** 142  
- **Mutual friends:** 4  

**Posts (10+ recent):** Track meet results, team photo with medals, training video, food prep, shoes, group with track team, race bib, stretching, homework photo, etc.  

**Photo gallery:** 10+ photos – track meets, training, team; same person; friends/teammates in many photos; school events, team dinners, practice.  

**Friends section:** 156 friends; teammates and school friends commenting.

---

### Red flags

None. This profile is safe.

### Green flags (for explanation only)

- Authentic personal photo (track uniform)  
- Account 8 months old (established)  
- 4 mutual friends  
- More followers than following (people follow athlete)  
- Consistent theme (track and field)  
- Real teammates in photos  
- Specific details (times, events, school)  
- Natural progression of content over time  

- **Correct decision:** ACCEPT  
- **Explanation if accepted (correct):** This is an authentic athlete’s account: 8 months old, 4 mutual friends, consistent track and field content, teammates in photos, specific details about races and times, and natural athletic community interactions. More followers than following makes sense for someone competing publicly.  
- **Explanation if rejected (wrong):** This was a real account. The profile showed authentic signs: established account (8 months), multiple mutual friends, consistent athletic theme, real teammates in photos, specific race details, and natural comments from the track community. Athletes often have more followers due to competitions – this is normal and safe.

---

## PROFILE 10 – AI-Generated Fake (Hard)

- **Username:** @skatergirl_emma_  
- **Display name:** Emma Rodriguez  
- **Profile photo:** AI-generated teen face (looks realistic but slightly "off")  
- **Bio:** "14 | Skateboarder 🛹 | Love meeting cool people | Add me let's chat!"  
- **Location:** San Diego, CA  
- **Account age:** Created 6 weeks ago  
- **Friends:** 234  
- **Followers:** 127  
- **Following:** 398  
- **Mutual friends:** 2  

**Posts (12 total):**

| ID      | Text                                          | Date      | Image     |
|---------|-----------------------------------------------|-----------|-----------|
| post_1  | "My board! 🛹"                                | 6 weeks ago | Skateboard |
| post_2  | "Vibes"                                      | 5 weeks ago | Sunset    |
| post_3  | "Morning energy ☕"                           | 4 weeks ago | Coffee    |
| post_4  | "Be yourself!"                                | 3 weeks ago | Quote     |
| post_5  | "Beach day"                                   | 3 weeks ago | Beach     |
| post_6  | "Looking for friends to chat with!"           | 2 weeks ago | No        |
| post_7  | "Anyone want to talk?"                        | 2 weeks ago | No        |
| post_8  | "Bored, DM me!"                              | 1 week ago  | No        |
| post_9  | "Add my Snap: emmarodriguez_23"               | 1 week ago  | No        |
| post_10 | "Who wants to video chat?"                    | 4 days ago  | No        |
| post_11 | "Looking for people to hang out with"         | 2 days ago  | No        |
| post_12 | "Message me if you want to talk about anything" | 1 day ago | No        |

**Photo gallery:** 7 photos – generic (skateboard, sunset, coffee, beach); no personal/friend photos; some look like different sources (inconsistent quality).  

**Friends section:** 234 friends.

---

### Red flags (14 total) – each maps to one elementKey

| # | elementKey       | Reason (short) |
|---|------------------|----------------|
| 1 | `profilePhoto`   | Profile photo may be AI-generated (too perfect, slightly uncanny) |
| 2 | `joinedDate`     | Account 6 weeks old but already 234 friends (adding rapidly) |
| 3 | `friends`        | 234 friends in 6 weeks (suspicious growth) |
| 4 | `following`      | Following 398 (mass-adding behavior) |
| 5 | `mutualFriends`  | Only 2 mutual friends (weak connection) |
| 6 | `bio`            | Very generic; "Add me let's chat!" (eager for contact) |
| 7 | `section_photos` | No friends in any photos; photos seem from different sources (inconsistent) |
| 8 | `post_6`         | Asks for friends to chat (suspicious) |
| 9 | `post_7`         | Asks who wants to talk (suspicious) |
|10 | `post_8`         | Asks for DMs (suspicious) |
|11 | `post_9`         | Pushes for Snapchat (off-platform) |
|12 | `post_10`        | Asks for video chat (suspicious) |
|13 | `post_11`        | Looking for people to hang out (suspicious) |
|14 | `post_12`        | Invites messages about anything (suspicious) |

- **Correct decision:** REJECT  
- **Explanation if rejected (correct):** This was a sophisticated fake using an AI-generated-style profile photo. Red flags: account added 234 friends in 6 weeks, following 398 (mass adding), recent posts all push for DMs/video chat/Snapchat, no friends in any photos, and photos seem from different sources. Predators now use AI to create realistic-looking fake profiles.  
- **Explanation if accepted (wrong):** This was an AI-style fake. Red flags you missed: profile photo may be AI-generated (look closely at the face), account rapidly added 234 friends in 6 weeks, following way more than followers, last several posts all ask for chats/DMs/video calls, pushes for Snapchat, no real friends in any photo, and posts escalate to pushing private communication. Be very careful with accounts that seem too eager to connect privately.

---

## Summary: Red-flag counts by profile

| Profile | Difficulty   | Correct decision | # Red flags (elementKey count) |
|---------|--------------|------------------|---------------------------------|
| 1       | Easy         | REJECT           | 7                               |
| 2       | Easy–Medium  | REJECT           | 10                              |
| 3       | Easy         | ACCEPT           | 0 (safe)                        |
| 4       | Hard         | REJECT           | 12                              |
| 5       | Medium       | ACCEPT           | 0 (safe)                        |
| 6       | Hard         | REJECT           | 11                              |
| 7       | Hard         | ACCEPT           | 0 (safe)                        |
| 8       | Easy         | REJECT           | 9                               |
| 9       | Medium       | ACCEPT           | 0 (safe)                        |
| 10      | Hard         | REJECT           | 14                              |

All red flags are mapped to a single elementKey (intro field, single post, or whole Friends/Photos section) so the game can implement one clickable target per flag and score consistently.
