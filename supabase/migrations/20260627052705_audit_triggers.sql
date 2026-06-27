-- 1. Trigger for User Ban/Suspend Actions
create or replace function public.trigger_audit_user_mod()
returns trigger
language plpgsql
security definer
as $$
declare
  v_admin_id uuid;
begin
  -- Try to get auth.uid(), which might be null if called via service_role directly,
  -- but we'll try to capture it.
  v_admin_id := auth.uid();
  
  if (NEW.is_banned = true and OLD.is_banned = false) then
    insert into public.admin_audit_log (admin_id, action, target_type, target_id, note)
    values (v_admin_id, 'BAN_USER', 'USER', NEW.id::text, 'Automatic audit log: User banned');
  elsif (NEW.is_suspended = true and OLD.is_suspended = false) then
    insert into public.admin_audit_log (admin_id, action, target_type, target_id, note)
    values (v_admin_id, 'SUSPEND_USER', 'USER', NEW.id::text, 'Automatic audit log: User suspended');
  end if;
  
  return NEW;
end;
$$;

create trigger audit_user_mod_trigger
after update on public.users
for each row
when (NEW.is_banned is distinct from OLD.is_banned or NEW.is_suspended is distinct from OLD.is_suspended)
execute function public.trigger_audit_user_mod();


-- 2. Trigger for Report Resolutions
create or replace function public.trigger_audit_report_resolve()
returns trigger
language plpgsql
security definer
as $$
begin
  if (NEW.status != 'PENDING' and OLD.status = 'PENDING') then
    insert into public.admin_audit_log (admin_id, action, target_type, target_id, note)
    -- NEW.resolved_by is explicitly set by the admin resolving the report
    values (NEW.resolved_by, 'RESOLVE_REPORT', 'REPORT', NEW.id::text, 'Automatic audit log: Report ' || NEW.status);
  end if;
  
  return NEW;
end;
$$;

create trigger audit_report_resolve_trigger
after update on public.reports
for each row
when (NEW.status is distinct from OLD.status)
execute function public.trigger_audit_report_resolve();


-- 3. Trigger for Post Deletions (by Admins)
create or replace function public.trigger_audit_post_delete()
returns trigger
language plpgsql
security definer
as $$
declare
  v_admin_id uuid;
begin
  v_admin_id := auth.uid();
  
  -- If auth.uid() is not the post owner, it's an admin/system deletion
  if (v_admin_id is not null and v_admin_id != OLD.user_id and public.is_admin(v_admin_id)) then
    insert into public.admin_audit_log (admin_id, action, target_type, target_id, note)
    values (v_admin_id, 'DELETE_POST', 'POST', OLD.id::text, 'Automatic audit log: Admin deleted post');
  end if;
  
  return OLD;
end;
$$;

create trigger audit_post_delete_trigger
before delete on public.posts
for each row
execute function public.trigger_audit_post_delete();
