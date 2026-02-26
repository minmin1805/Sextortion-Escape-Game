import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import thiefImage from "../assets/GamePage/thiefimage.png";
import person1 from "../assets/GamePage/person1.png";
import person2 from "../assets/GamePage/person2.png";
import person3 from "../assets/GamePage/person3.png";
import person4 from "../assets/GamePage/person4.png";
import person5 from "../assets/GamePage/person5.png";
import person6 from "../assets/GamePage/person6.png";
import NCMECImage from "../assets/GamePage/NCMEC.png.png";
import { IoVideocamOutline, IoCallOutline, IoInformationCircleOutline, IoSendOutline, IoHappyOutline, IoClose } from "react-icons/io5";
import { FaImage } from "react-icons/fa";

const BAD_GUY_MESSAGE_DELAY_MS = 2000;
const CONSEQUENCE_ANIMATION_DELAY = 2;       // seconds before consequence reply fades in (hardcoded in motion)
const CONSEQUENCE_ANIMATION_DURATION = 0.5;

const STATS_FRIEND = {
  jessica: { name: "Jessica", image: person1 },
  thompson: { name: "Thompson", image: person2 },
  erica: { name: "Erica", image: person3 },
};

const TRUSTED_ADULT = {
  dad: { name: "Dad", image: person2 },
  mom: { name: "Mom", image: person5 },
  uncle_bill: { name: "Uncle Bill", image: person6 },
};

const HELPING_FRIEND = {
  erica: { name: "Erica", image: person1 },
};

const NCMEC_MESSAGE = "Hi NCMEC, I am being exploited by this person online. I will send you evidence. Can you help me?";

function getTrustedAdultMessage(trustedAdultKey) {
  const name = TRUSTED_ADULT[trustedAdultKey]?.name ?? "someone";
  return `Hi ${name}, someone online texted and threatened me to send them photos. I am scared. Can you help me?`;
}

function QuestionDisplay({
  message,
  question,
  playerName,
  selectedAnswerText,
  isTransitioning,
  isStatsQuestion,
  statsFriend,
  correctAnswerType,
  trustedAdult,
  selectedOptionId,
  correctOptionId,
  threadReplyText,
  threadReplyFrom,
  isHelpingFriend,
  helpingFriend,
  switchedThreadPlayerMessage,
  playerMessageOverride,
}) {
  const [showSenderMessage, setShowSenderMessage] = useState(false);

  const isCorrectAnswer = selectedOptionId != null && selectedOptionId === correctOptionId;
  const showBlockAnimation = isCorrectAnswer && correctAnswerType === "block";
  const showReportAnimation = isCorrectAnswer && correctAnswerType === "report";
  const showTellAdultAnimation = isCorrectAnswer && correctAnswerType === "tell_adult";
  const showSwitchedThreadIncorrect = !!switchedThreadPlayerMessage;

  const playerBubbleText = playerMessageOverride ?? selectedAnswerText;

  useEffect(() => {
    if (isTransitioning) {
      setShowSenderMessage(false);
      return;
    }
    setShowSenderMessage(false);
    const t = setTimeout(() => setShowSenderMessage(true), BAD_GUY_MESSAGE_DELAY_MS);
    return () => clearTimeout(t);
  }, [message, question, isTransitioning]);

  const fullMessage = [
    message,
    question &&
    question.trim() !== "What should you do?" &&
    question.trim() !== (message || "").trim()
      ? question
      : null
  ].filter(Boolean).join("\n\n");

  const friendStatsMessage = isStatsQuestion && question
    ? `Hi ${playerName || "there"}, how are you doing? I just learned about this information – very interesting and I think all of my friends should know it too.\n\n${question}\n\nWhat do you think is the answer to this?`
    : fullMessage;

  const isStats = !!isStatsQuestion;
  const friendInfo = isStats && statsFriend ? STATS_FRIEND[statsFriend] : null;
  const isHelping = !!isHelpingFriend;
  const helpingFriendInfo = isHelping && helpingFriend ? HELPING_FRIEND[helpingFriend] : null;

  const displayMessage = isHelping && message && typeof message === "string"
    ? message.replace(/\{\{playerName\}\}/g, playerName || "there")
    : null;

  const showSwitchedThread = showReportAnimation || showTellAdultAnimation || showSwitchedThreadIncorrect;
  const switchedContact = showReportAnimation
    ? { name: "NCMEC", image: NCMECImage, subtitle: "Report & support" }
    : (showTellAdultAnimation || showSwitchedThreadIncorrect) && trustedAdult
    ? { ...TRUSTED_ADULT[trustedAdult], subtitle: "Active now" }
    : null;

  const displayPlayerBubble = !!playerBubbleText && !showBlockAnimation && !showSwitchedThread;

  const hasDelayedConsequence =
    threadReplyFrom === "ncmec" ||
    threadReplyFrom === "trusted_adult" ||
    (threadReplyFrom === "friend" && isHelpingFriend && isCorrectAnswer);
  const consequenceDelaySeconds = hasDelayedConsequence ? CONSEQUENCE_ANIMATION_DELAY : 0;

  const headerAvatar = showSwitchedThread && switchedContact
    ? switchedContact.image
    : helpingFriendInfo
    ? helpingFriendInfo.image
    : friendInfo
    ? friendInfo.image
    : thiefImage;

  const headerName = showSwitchedThread && switchedContact
    ? switchedContact.name
    : helpingFriendInfo
    ? helpingFriendInfo.name
    : friendInfo
    ? friendInfo.name
    : "Unknown";

  const headerSubtitle = showSwitchedThread && switchedContact
    ? switchedContact.subtitle ?? "Active now"
    : "Active now";

  const showBlockedBadge = showBlockAnimation;

  return (
    <div className="bg-white w-[55%] min-h-[320px] rounded-2xl flex flex-col shadow-xl overflow-hidden border border-gray-200">
      {/* Top bar - Messenger style */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full bg-gray-300 overflow-hidden shrink-0">
            <img src={headerAvatar} alt="" className="w-full h-full object-cover" />
            {showBlockedBadge && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-500/80 rounded-full">
                <IoClose className="w-8 h-8 text-white" aria-hidden />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div>
              <p className={`font-bold ${showBlockedBadge ? "text-red-600 line-through" : "text-gray-800"}`}>
                {headerName}
              </p>
              {!showBlockedBadge && (
                <p className="text-xs text-gray-500">{headerSubtitle}</p>
              )}
            </div>
            {showBlockedBadge && (
              <IoClose className="w-5 h-5 text-red-500 shrink-0" aria-hidden />
            )}
          </div>
        </div>
        {!showBlockedBadge && (
          <div className="flex items-center gap-2 text-[#8B5CF6]">
            <button type="button" className="p-2 rounded-full hover:bg-gray-100" aria-label="Call">
              <IoCallOutline className="w-6 h-6" />
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-gray-100" aria-label="Video call">
              <IoVideocamOutline className="w-6 h-6" />
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-gray-100" aria-label="Info">
              <IoInformationCircleOutline className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Thread area */}
      <div className="flex-1 overflow-auto p-4 space-y-3 bg-[#f0f2f5] min-h-[200px]">
        {showSwitchedThread ? (
          <>
            {/* Switched thread: player message then reply from NCMEC or trusted adult */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex justify-end"
            >
              <div className="max-w-[80%]">
                <div className="bg-[#8B5CF6] text-white px-4 py-3 rounded-2xl rounded-br-md shadow-sm">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.45, ease: "easeOut" }}
                    className="text-lg whitespace-pre-line"
                  >
                    {switchedThreadPlayerMessage ?? (showReportAnimation ? NCMEC_MESSAGE : getTrustedAdultMessage(trustedAdult))}
                  </motion.p>
                </div>
              </div>
            </motion.div>
            {/* Reply from NCMEC or trusted adult – delay hardcoded in motion */}
            {threadReplyText && (threadReplyFrom === "ncmec" || threadReplyFrom === "trusted_adult") && switchedContact && (
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: consequenceDelaySeconds, duration: CONSEQUENCE_ANIMATION_DURATION, ease: "easeOut" }}
                className="flex items-end gap-2 justify-start"
              >
                <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden shrink-0 self-end">
                  <img src={switchedContact.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="max-w-[80%]">
                  <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <p className="text-lg whitespace-pre-line">{threadReplyText}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <>
            {/* Sender message - helping friend (Erica), stats friend, or trafficker (threat) */}
            {showSenderMessage && (
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-end gap-2 justify-start"
              >
                <div className="relative w-12 h-12 rounded-full bg-gray-300 overflow-hidden shrink-0 self-end">
                  <img
                    src={helpingFriendInfo ? helpingFriendInfo.image : friendInfo ? friendInfo.image : thiefImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {showBlockAnimation && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500/80 rounded-full">
                      <IoClose className="w-6 h-6 text-white" aria-hidden />
                    </div>
                  )}
                </div>
                <div className="max-w-[80%]">
                  <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <p className="whitespace-pre-line text-lg">
                      {isHelping && displayMessage ? displayMessage : isStats ? friendStatsMessage : fullMessage || "No message"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Block confirmation bubble – fade in */}
            {showBlockAnimation && (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex justify-end"
              >
                <div className="max-w-[80%]">
                  <div className="bg-gray-300 text-gray-700 px-4 py-3 rounded-2xl rounded-br-md shadow-sm border border-gray-400">
                    <p className="text-lg">You have blocked this user</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Player answer - right, when not showing switched thread and not block-only (use ourThreadMessage override for helping_friend incorrect A/B) */}
            {displayPlayerBubble && (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex justify-end"
              >
                <div className="max-w-[80%]">
                  <div className="bg-[#8B5CF6] text-white px-4 py-3 rounded-2xl rounded-br-md shadow-sm">
                    <p className="text-lg">{playerBubbleText}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reply in thread from trafficker or friend – delay hardcoded in motion */}
            {threadReplyText && (threadReplyFrom === "trafficker" || threadReplyFrom === "friend") && (
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: consequenceDelaySeconds, duration: CONSEQUENCE_ANIMATION_DURATION, ease: "easeOut" }}
                className="flex items-end gap-2 justify-start"
              >
                <div className="relative w-12 h-12 rounded-full bg-gray-300 overflow-hidden shrink-0 self-end">
                  <img
                    src={helpingFriendInfo ? helpingFriendInfo.image : friendInfo ? friendInfo.image : thiefImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="max-w-[80%]">
                  <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <p className="text-lg whitespace-pre-line">{threadReplyText}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Bottom entry text bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 bg-white shrink-0">
        <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-gray-500" aria-label="Attach">
          <FaImage className="w-6 h-6" />
        </button>
        <input
          type="text"
          placeholder="..."
          readOnly
          className="flex-1 rounded-2xl bg-[#f0f2f5] px-4 py-2 min-h-[40px] text-gray-800 text-sm border-0 outline-none placeholder:text-gray-400"
        />
        <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-gray-500" aria-label="Emoji">
          <IoHappyOutline className="w-6 h-6" />
        </button>
        <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-[#8B5CF6]" aria-label="Send">
          <IoSendOutline className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default QuestionDisplay;
