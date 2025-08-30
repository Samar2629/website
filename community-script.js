// --- PART 1: CURSOR GLOW EFFECT ---
(() => {
    const glow = document.getElementById("cursor-glow");
    if (!glow) return;
    document.body.addEventListener("mousemove", e => {
        const { clientX, clientY } = e;
        glow.style.transform = `translate(${clientX}px, ${clientY}px)`;
    });
})();


// --- PART 2: DISCORD WIDGET API LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://discord.com/api/guilds/1394714934960721981/widget.json';

    const serverNameEl = document.getElementById('server-name');
    const onlineCountEl = document.getElementById('online-count');
    const memberListEl = document.getElementById('member-list');
    const voiceChannelListEl = document.getElementById('voice-channel-list');

    async function fetchDiscordData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            const data = await response.json();

            // Render Server Info
            serverNameEl.textContent = data.name || 'Unknown Server';
            onlineCountEl.innerHTML = `<span class="dot"></span>${data.presence_count || 0} Online`;

            // Render Online Members List
            memberListEl.innerHTML = '';
            if (data.members && data.members.length > 0) {
                data.members.forEach(member => {
                    const li = document.createElement('li'); li.className = 'member-item';
                    const avatar = document.createElement('img'); avatar.className = 'member-avatar'; avatar.src = member.avatar_url; avatar.alt = `${member.username}'s avatar`;
                    const name = document.createElement('span'); name.className = 'member-name'; name.textContent = member.username;
                    li.appendChild(avatar); li.appendChild(name); memberListEl.appendChild(li);
                });
            } else { memberListEl.innerHTML = '<li class="loading-state">No members are currently visible.</li>'; }

            // Render Voice Channels and Members
            voiceChannelListEl.innerHTML = '';
            const channelsMap = {};
            data.channels.forEach(channel => { channelsMap[channel.id] = { name: channel.name, members: [] }; });
            data.members.forEach(member => { if (member.channel_id && channelsMap[member.channel_id]) { channelsMap[member.channel_id].members.push(member); } });

            let inVoice = false;
            for (const channelId in channelsMap) {
                const channel = channelsMap[channelId];
                if (channel.members.length > 0) {
                    inVoice = true;
                    const channelLi = document.createElement('li'); channelLi.className = 'voice-channel-item';
                    const channelName = document.createElement('strong'); channelName.className = 'channel-name'; channelName.textContent = channel.name;
                    channelLi.appendChild(channelName);
                    const voiceMembersUl = document.createElement('ul'); voiceMembersUl.className = 'voice-member-list';
                    channel.members.forEach(member => {
                        const memberLi = document.createElement('li'); memberLi.className = 'member-item';
                        const avatar = document.createElement('img'); avatar.className = 'member-avatar'; avatar.src = member.avatar_url; avatar.alt = `${member.username}'s avatar`;
                        const name = document.createElement('span'); name.className = 'member-name'; name.textContent = member.username;
                        memberLi.appendChild(avatar); memberLi.appendChild(name); voiceMembersUl.appendChild(memberLi);
                    });
                    channelLi.appendChild(voiceMembersUl);
                    voiceChannelListEl.appendChild(channelLi);
                }
            }
            if (!inVoice) { voiceChannelListEl.innerHTML = '<li class="loading-state">No one is currently in a voice channel.</li>'; }
        } catch (error) {
            console.error('Failed to fetch Discord data:', error);
            serverNameEl.textContent = 'Error Loading Widget';
            memberListEl.innerHTML = '<li class="loading-state">Could not fetch data.</li>';
            voiceChannelListEl.innerHTML = '<li class="loading-state">Could not fetch data.</li>';
        }
    }
    fetchDiscordData();
});
