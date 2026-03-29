import { eventDetails } from "@/data/reunion-config";

export function AdminHelp() {
  return (
    <div className="reunion-page min-h-screen py-8 px-4">
      <div className="reunion-grain" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="reunion-title text-3xl sm:text-4xl mb-2">Admin Guide</h1>
        <p className="reunion-subtitle text-sm tracking-widest uppercase mb-8">
          {eventDetails.title}
        </p>

        <div className="space-y-6">

          {/* Overview */}
          <Section title="Overview">
            <p>
              As an admin, you have full control over the reunion RSVP system.
              You can manage guest lists, track responses, send invitations,
              post news updates, manage the photo gallery, and export data.
            </p>
            <p>
              The admin panel is accessed by clicking the <Kbd>Admin</Kbd> button
              in the top-right corner after logging in. It has four tabs:
              <strong> Status</strong>, <strong>Meals &amp; Export</strong>,{" "}
              <strong>Manage</strong>, and <strong>News</strong>.
            </p>
          </Section>

          {/* Status Tab */}
          <Section title="Status Tab">
            <p>
              Shows all family members with their RSVP status. The summary bar
              shows how many families have responded.
            </p>
            <SubSection title="Sorting">
              Click any column header (<strong>Family Member</strong>,{" "}
              <strong>Status</strong>, <strong>Attending</strong>) to sort.
              Click again to reverse the sort direction.
            </SubSection>
            <SubSection title="Icons next to each member">
              <IconRow
                icon={<PersonIcon />}
                label="Edit Profile"
                desc="Change the member's name or email address. Opens a dialog where you can update and save."
              />
              <IconRow
                icon={<PencilIcon />}
                label="Edit RSVP"
                desc="Change the member's attendance status and meal selections. Opens a focused edit form."
              />
              <IconRow
                icon={<LinkIcon />}
                label="Copy Invite Link"
                desc="Copies their personalized RSVP link to your clipboard. Share it via text, WhatsApp, etc."
              />
              <IconRow
                icon={<EmailIcon />}
                label="Send Invite Email"
                desc="Sends a styled invitation email to the member (if they have an email on file). If no email, copies the invite text to your clipboard."
              />
            </SubSection>
            <SubSection title="Bulk actions">
              <strong>Copy All Links</strong> — copies every member&rsquo;s name
              and personalized link as a formatted list. Useful for pasting into
              a group chat.
            </SubSection>
            <SubSection title="Collapsing">
              Click the &#x25B6; arrow or the summary bar to collapse/expand
              the table.
            </SubSection>
          </Section>

          {/* Meals & Export */}
          <Section title="Meals &amp; Export Tab">
            <p>
              Shows all submitted RSVPs with meal selections. Sortable by
              guest name, RSVP status, or any meal category.
            </p>
            <SubSection title="Export PDF">
              Click <strong>Export PDF</strong> to download a formatted PDF
              matching the original invitation&rsquo;s RSVP table. Includes
              all guest names, attendance, meal choices, and a menu legend.
              Great for sharing with Kelsey&rsquo;s for the event.
            </SubSection>
          </Section>

          {/* Manage Tab */}
          <Section title="Manage Tab">
            <p>
              Three collapsible sections — click the &#x25B6; arrow to
              expand each one.
            </p>
            <SubSection title="Guest Delegation">
              <p>
                Assign family members to be managed by another person. For
                example, assign Callum and Kate to Jennifer — when Jennifer
                logs in, she&rsquo;ll see a dropdown to edit their RSVPs.
              </p>
              <p>
                Click the gold chip buttons to toggle managers on/off for
                each person. A person can have multiple managers. Admins
                (David, Ken Jr) can already edit anyone without delegation.
              </p>
            </SubSection>
            <SubSection title="Add Family Members">
              <p>
                Type a name and click <strong>Add</strong>. A code is
                auto-generated (e.g., &ldquo;Sarah&rdquo; becomes{" "}
                <code className="reunion-code">sarah2026</code>). Share the
                code with them so they can log in.
              </p>
              <p>
                <strong>Export CSV</strong> — downloads a spreadsheet with
                all members&rsquo; names, emails, and access codes.
              </p>
              <p>
                Each member has an <strong>Edit</strong> button to change
                their name, access code, or email.
              </p>
            </SubSection>
          </Section>

          {/* News Tab */}
          <Section title="News Tab">
            <p>
              Post updates that appear on the reunion front page for all
              visitors — both before and after they log in.
            </p>
            <SubSection title="Posting an update">
              <p>
                Fill in a title and message, then click{" "}
                <strong>Post Update</strong>.
              </p>
              <p>
                <strong>Pin to top</strong> — keeps the update at the top of
                the news feed, highlighted with a &#x1F4CC; icon.
              </p>
              <p>
                <strong>Email to subscribers</strong> — sends the update to
                all family members who have opted in to email notifications.
                The count shows how many are subscribed.
              </p>
            </SubSection>
            <SubSection title="Managing posts">
              Each post has a pin toggle and a delete button.
            </SubSection>
          </Section>

          {/* Photos */}
          <Section title="Photo Gallery">
            <p>
              All logged-in family members can upload photos via the{" "}
              <strong>Photos</strong> tab (toggle at the top of the page).
            </p>
            <SubSection title="Uploading">
              Drag and drop a photo or click to browse. Add an optional
              caption. Maximum file size is 10MB.
            </SubSection>
            <SubSection title="Slideshow">
              Click <strong>&#x25B6; Slideshow</strong> to start a
              fullscreen auto-advancing slideshow — perfect for displaying
              on a screen at the event.
              <div className="mt-2">
                <strong>Keyboard shortcuts:</strong>
              </div>
              <ul className="mt-1 space-y-1 ml-4">
                <li><Kbd>&larr;</Kbd> <Kbd>&rarr;</Kbd> Previous / next photo</li>
                <li><Kbd>Space</Kbd> Next photo</li>
                <li><Kbd>P</Kbd> Play / pause auto-advance</li>
                <li><Kbd>F</Kbd> Toggle fullscreen</li>
                <li><Kbd>Esc</Kbd> Close slideshow</li>
              </ul>
            </SubSection>
            <SubSection title="Deleting photos (admin only)">
              Hover over any photo in the gallery to reveal a red delete
              button in the top-right corner. Click it and confirm to
              permanently remove the photo.
            </SubSection>
          </Section>

          {/* Invitations */}
          <Section title="Sending Invitations">
            <p>There are three ways to invite family members:</p>
            <SubSection title="1. Copy individual link">
              In the Status tab, click the &#x1F517; link icon next to any
              member. Their personalized link (e.g.,{" "}
              <code className="reunion-code">
                david-martin.ca/reunion?code=ingrid2026
              </code>
              ) is copied to your clipboard.
            </SubSection>
            <SubSection title="2. Send invite email">
              Click the &#x2709; email icon to send a styled HTML email from{" "}
              <code className="reunion-code">info@david-martin.ca</code>.
              The member must have an email on file (edit their profile to
              add one).
            </SubSection>
            <SubSection title="3. Copy all links">
              Click <strong>Copy All Links</strong> to get every member&rsquo;s
              name and link in one formatted list.
            </SubSection>
          </Section>

          {/* Email Subscriptions */}
          <Section title="Email Subscriptions">
            <p>
              Guests can opt in to receive news updates by email. After
              submitting their RSVP, they see a checkbox:
              &ldquo;Email me updates&rdquo;. This is off by default —
              fully opt-in.
            </p>
            <p>
              When posting news, check &ldquo;Email to N subscribers&rdquo;
              to send the update only to those who opted in.
            </p>
          </Section>

          {/* Quick Reference */}
          <Section title="Quick Reference">
            <div className="overflow-x-auto">
              <table className="reunion-admin-table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Task</th>
                    <th className="text-left">Where to find it</th>
                  </tr>
                </thead>
                <tbody>
                  <RefRow task="See who has RSVP'd" where="Status tab" />
                  <RefRow task="Edit someone's meal" where="Status tab → ✏️ pencil icon" />
                  <RefRow task="Change someone's name or email" where="Status tab → 👤 person icon" />
                  <RefRow task="Send an invitation" where="Status tab → ✉️ email icon" />
                  <RefRow task="Export meal summary PDF" where="Meals & Export tab → Export PDF" />
                  <RefRow task="Add a new family member" where="Manage tab → Add Family Members" />
                  <RefRow task="Export member list CSV" where="Manage tab → Add Family Members → Export CSV" />
                  <RefRow task="Set up delegation" where="Manage tab → Guest Delegation" />
                  <RefRow task="Post an announcement" where="News tab → Post an Update" />
                  <RefRow task="Delete a photo" where="Photos tab → hover photo → delete icon" />
                  <RefRow task="Run slideshow at event" where="Photos tab → ▶ Slideshow → F for fullscreen" />
                </tbody>
              </table>
            </div>
          </Section>

        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="reunion-body text-xs opacity-40">
            Questions? Contact{" "}
            <a href={`mailto:${eventDetails.contactEmail}`} className="underline hover:opacity-80">
              {eventDetails.contactEmail}
            </a>{" "}
            or call {eventDetails.contactPhone}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Helper components ──

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="reunion-card p-6">
      <h2 className="reunion-heading text-lg mb-3">{title}</h2>
      <div className="reunion-body text-sm opacity-80 space-y-3">{children}</div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <h3 className="reunion-heading text-sm mb-1">{title}</h3>
      <div className="reunion-body text-sm opacity-70">{children}</div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono reunion-body">
      {children}
    </kbd>
  );
}

function IconRow({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div className="flex gap-3 mt-2">
      <div className="reunion-invite-btn flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <span className="reunion-heading text-xs">{label}</span>
        <span className="reunion-body text-xs opacity-60"> — {desc}</span>
      </div>
    </div>
  );
}

function RefRow({ task, where }: { task: string; where: string }) {
  return (
    <tr>
      <td className="reunion-body text-sm">{task}</td>
      <td className="reunion-body text-sm opacity-60">{where}</td>
    </tr>
  );
}

// ── SVG Icons ──

function PersonIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
