%{!?_name: %define _name du-api-recentnews}
%{!?_version: %define _version 1.0.0}
%{!?_build_number: %define _build_number 1}

Name:		%{_name}
Version:	%{_version}
Release:	%{_build_number}.noarch
Summary:	The CLiP service profived feature flags as a service
Group:		DU
License:	LGPL
URL:		http://github.com/russellsimpkins/clip-service
Requires:   golang

%description
The CLiP service profived feature flags as a service

%prep

%build
cd %{_sourcedir}
make %{?_smp_mflags} 

%install
rm -rf $RPM_BUILD_ROOT
mkdir -p $RPM_BUILD_ROOT
cd %{_sourcedir}
echo "{
  \"name\": \"%{_name}\",
  \"built-on\": \"$(date)\",
  \"rpm\": \"%{name}-%{version}-%{release}.%{_arch}.rpm\",
  \"full-version\": \"%{name}-%{version}-%{release}\",
  \"version\": \"%{_version}-%{_build_number}\",
  \"commit\": \"%{_commit}\"
}" > bin/version.json
make install DESTDIR=$RPM_BUILD_ROOT

%clean
rm -rf %{_sourcedir}
rm -rf %{_buildrootdir}/%{name}-%{version}-%{release}.*

%files
%defattr(-,root,root,-)
%doc
/

%changelog

