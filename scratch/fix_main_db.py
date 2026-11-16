with open('electron/main.js', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'custDb.prepare("DELETE FROM users").run();'
replacement = '''custDb.pragma("foreign_keys = OFF");
      custDb.prepare("DELETE FROM security_questions").run();
      custDb.prepare("DELETE FROM user_sessions").run();
      custDb.prepare("DELETE FROM audit_logs").run();
      custDb.prepare("DELETE FROM search_history").run();
      custDb.prepare("DELETE FROM annotations").run();
      custDb.prepare("DELETE FROM bookmarks").run();
      custDb.prepare("DELETE FROM users").run();'''

# Also remove duplicate deletes below if present
c = c.replace(target, replacement)
# remove the extra deletes that were after target
c = c.replace('''      custDb.prepare("DELETE FROM user_sessions").run();
      custDb.prepare("DELETE FROM audit_logs").run();
      custDb.prepare("DELETE FROM search_history").run();
      custDb.prepare("DELETE FROM annotations").run();
      custDb.prepare("DELETE FROM bookmarks").run();''', '')

with open('electron/main.js', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated electron/main.js cleanly!')

