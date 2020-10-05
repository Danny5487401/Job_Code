"""ordov URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from candidates import views as candidatesViews
from resumes import views as resumesViews
from accounts import views as accountsViews
from companies import views as companiesViews
from interviews import views as interviewsViews
from experiences import views as experiencesViews
from permissions import views as permissionsViews

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'resumes', resumesViews.ResumeViewSet)
router.register(r'candidates', candidatesViews.CandidateViewSet)
router.register(r'posts', companiesViews.PostViewSet)
router.register(r'interviews', interviewsViews.InterviewViewSet)
router.register(r'experiences', experiencesViews.ExperienceViewSet)
router.register(r'educations', resumesViews.EducationViewSet)
router.register(r'projects', experiencesViews.ProjectViewSet)
router.register(r'languages', experiencesViews.LanguageViewSet)
router.register(r'certifications', experiencesViews.CertificationViewSet)
router.register(r'permissions', permissionsViews.ProjectPermissionViewSet)
router.register(r'accounts', accountsViews.UserProfileViewSet)
router.register(r'tags', resumesViews.TagViewSet)
router.register(r'labellibs', resumesViews.LabelLibViewSet)
router.register(r'labellibslist', resumesViews.LabelLibListViewSet)
router.register(r'labelscore', resumesViews.LabelScoreViewSet)
router.register(r'labelscorelog', resumesViews.LabelScoreLogViewSet)
router.register(r'interviewcount', interviewsViews.Interview_CountViewSet)
router.register(r'interviewsubphonecalllog', interviewsViews.InterviewSub_Phone_Call_LogViewSet)
router.register(r'addresume', resumesViews.Add_ResumeViewSet)







# Look at here: all path pattern should be ENDUP with '/'
urlpatterns = [
    path('view/job/<int:post_id>', companiesViews.job, name='job'),
    path('view/job_commit', companiesViews.job_commit, name='job_commit'),

    path('view/create_company', companiesViews.create_company, name='create_company'),
    path('view/create_company_post', companiesViews.create_company_post, name='create_company_post'),

    path('accounts/signup/', accountsViews.signup, name='accounts_signup'),
    path('accounts/signin/', accountsViews.signin, name='accounts_signin'),
    path('process/', accountsViews.process, name='process'),
    path('accounts/login/', accountsViews.MyLoginView.as_view(), name='login'),

    path('accounts/' , include('allauth.urls')),

    path('api/v1/getResult', interviewsViews.aiTest),
    path('candidates/resume/update/', candidatesViews.updateResume, name='candidate_update_resume'),
    path('candidates/resume/success/', candidatesViews.apply_success, name='candidate_apply_success'),

    path('admin/', admin.site.urls),

    path('', include('landing_page.urls')),

    path('manager/', include('recruit_manager.urls'), name='manager'),
    path('company/', include('recruit_company.urls'), name='company'),
    path('applicant/', include('recruit_applicant.urls'), name='applicant'),

    path('api/', include(router.urls)),
    path('post/post/update/', companiesViews.UpdatePost),
    path('interview/ai/update/', interviewsViews.UpdateAIStatus),
    path('interview/ai/task/', interviewsViews.Task),
    path('interview/ai/info/', interviewsViews.getAIInfo),
    path('interview/ai/detail/', interviewsViews.getAIDetail),

    path('api/dofinish', resumesViews.dofinish, name='dofinish'),
    path('api/opresumelog', resumesViews.opresumelog, name='opresumelog'),
    path('api/opresumeloglist', resumesViews.opresumeloglist, name='opresumeloglist'),
    path('api/msgbox', resumesViews.msgbox, name='msgbox'),

    path('api/conn_websocket', resumesViews.conn_websocket, name='conn_websocket'),
    path('api/edit_post_page', companiesViews.edit_post_page, name='edit_post_page'),
    path('api/project_info', companiesViews.project_info, name='project_info'),
    path('api/delLib', resumesViews.delLib, name='delLib'),
    path('api/addLib', resumesViews.addLib, name='addLib'),
    path('api/editLib', resumesViews.editLib, name='editLib'),


    path('api/updatelib', resumesViews.updatelib, name='updatelib'),
    path('api/call_flag', resumesViews.call_flag, name='call_flag'),

    path('api/replyQuestion', interviewsViews.replyQuestion, name='replyQuestion'),
    path('api/queryQuestion', interviewsViews.queryQuestion, name='queryQuestion'),

    path('interviews/', include('interviews.urls'))
]
