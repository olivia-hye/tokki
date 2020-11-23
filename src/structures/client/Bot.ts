import { Client, MessageEmbed, TextChannel } from "discord.js";
import config from "../../../config.json";

export class Bot extends Client {
  lounge!: TextChannel;
  public async init() {
    this.once("ready", async () => {
      console.log("[ Tokki ] - Connected to Discord.");

      this.lounge = <TextChannel>(
        await this.channels.fetch(config.discord.channels.lounge)
      );

      const updates = <TextChannel>(
        await this.channels.fetch("752041568998916186")
      );
      const message = await updates.messages.fetch(`779964460844449793`);
      const values = message.reactions.cache.values();
      for (let v of values) {
        const users = v.users.cache.values();

        for (let user of users) {
          const member = updates.guild.member(user);
          if (!member) return;
          await member.roles.add("780567298502295602");
        }
      }
    });

    this.on("message", async (m) => {
      // Feedback Channel
      if (
        m.channel.id === config.discord.channels.bugreport ||
        m.channel.id === config.discord.channels.feedback ||
        m.channel.id === config.discord.channels.emoterequest
      ) {
        await m.react("774409850410500116");
        await m.react("774410335058001922");
      }
    });

    // Welcomer
    this.on("guildMemberAdd", async (m) => {
      const embed = new MessageEmbed()
        .setAuthor(
          `New Member | ${m.user.tag}`,
          `https://i.imgur.com/KTkUpIn.png`
        )
        .setColor(`#FFAACC`)
        .setDescription(
          `Welcome, ${m}!` +
            `\nFeel free to play, ask questions, or leave feedback!` +
            `\nYou can also use \`!help\` to see the Help Center.`
        )
        .setThumbnail(m.user.displayAvatarURL())
        .setFooter(`👋 Member #${m.guild.members.cache.size.toLocaleString()}`)
        .setTimestamp(Date.now());
      await this.lounge.send(embed);
      await m.roles.add(`753014710084960327`);
    });

    this.on("messageReactionAdd", async (r, u) => {
      console.log(`received - ${r.message.id}`);
      if (r.message.id !== "774782558956945458") return;

      const member = await r.message.guild!.members.fetch(u.id);
      if (r.emoji.name === "1️⃣") {
        await member.roles.add("774783479828971520");
      } else if (r.emoji.name === "2️⃣") {
        await member.roles.add("774783485722361876");
      } else if (r.emoji.name === "3️⃣") {
        await member.roles.add("774783486681808907");
      } else if (r.emoji.name === "💸") {
        await member.roles.add("774783487479513088");
      }
      return;
    });
    this.on("messageReactionRemove", async (r, u) => {
      if (r.message.id !== "774782558956945458") return;

      const member = await r.message.guild!.members.fetch(u.id);
      if (r.emoji.name === "1️⃣") {
        await member.roles.remove("774783479828971520");
      } else if (r.emoji.name === "2️⃣") {
        await member.roles.remove("774783485722361876");
      } else if (r.emoji.name === "3️⃣") {
        await member.roles.remove("774783486681808907");
      } else if (r.emoji.name === "💸") {
        await member.roles.remove("774783487479513088");
      }
      return;
    });

    this.login(config.discord.token);
  }

  constructor() {
    super({ partials: ["REACTION", "MESSAGE", "GUILD_MEMBER"] });
  }
}
