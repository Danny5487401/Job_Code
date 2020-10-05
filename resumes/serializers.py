from rest_framework import serializers

from candidates.serializers import CandidateSerializer
from .models import Resume, Education, Tag, OperatorLog, LabelLib, LabelScore, LabelScoreLog,AddResume
from companies.models import Company, Department, Post

from interviews.models import Interview, STATUS_CHOICES, InterviewSub_Interview

from ordov.choices import (DEGREE_CHOICES, DEGREE_CHOICES_MAP)
from third_party.views import getBaiyingTaskList, importTaskCustomer, get_num_of_instances, get_job_instances2, \
    get_instance_info
import time
import json
import logging

logger = logging.getLogger('django')

def time_long(time1, time2, type="day"):
    """
    计算时间差
    :param time1: 较小的时间（datetime类型）
    :param time2: 较大的时间（datetime类型）
    :param type: 返回结果的时间类型（暂时就是返回相差天数）
    :return: 相差的天数
    """
    day1 = time.strptime(str(time1), '%Y-%m-%d')
    day2 = time.strptime(str(time2), '%Y-%m-%d')
    if type == 'day':
        day_num = (int(time.mktime(day2)) - int(time.mktime(day1))) / (
                24 * 60 * 60)
    return abs(int(day_num))

class ResumeSerializer(serializers.ModelSerializer):
    candidate = CandidateSerializer(required=False)
    candidate_id = serializers.SerializerMethodField()
    resume_way = serializers.SerializerMethodField()
    resume_way2 = serializers.SerializerMethodField()
    interview_id = serializers.SerializerMethodField()
    interview_status = serializers.SerializerMethodField()
    interview_status_name = serializers.SerializerMethodField()
    workexp = serializers.SerializerMethodField()
    workexp_list = serializers.SerializerMethodField()
    ageg = serializers.SerializerMethodField()
    majorfull = serializers.SerializerMethodField()
    newname = serializers.SerializerMethodField()
    birthorigin = serializers.SerializerMethodField()
    expected = serializers.SerializerMethodField()
    current_settle = serializers.SerializerMethodField()
    lastmod = serializers.SerializerMethodField()
    ai_called = serializers.SerializerMethodField()
    importer = serializers.SerializerMethodField()
    qq = serializers.SerializerMethodField()

    def get_qq(self, resume):
        return resume.qq
    def get_importer(self,resume):
        return resume.importer

    def get_ai_called(self,resume):
        if resume.ai_called is None or resume.ai_called == '':
            return []
        return resume.ai_called.split(',')

    def get_candidate_id(self, resume):
        if resume.candidate:
            return resume.candidate.id
        else:
            return None

    def get_resume_way(self, resume):
        return resume.resume_way

    def get_resume_way2(self, resume):
        return resume.resume_way2

    def get_id(self, resume):
        return resume.id

    def get_ageg(self, resume):
        return "年龄:" + str(resume.age)+" " "毕业: "+str(resume.graduate_time)

    def get_graduate_time(self, resume):
        return str(resume.graduate_time)

    def get_majorfull(self, resume):
        degree_str = ""
        return ''
        if type(resume.degree) == type(1):
            degree_str = DEGREE_CHOICES[resume.degree][1]
        elif type(resume.degree) == type("str"):
            degree_str = resume.degree
        major_str = resume.major
        return resume.school + ">" + degree_str + ">" + major_str

    def get_newname(self, resume):
        if resume.gender == "Male":
            return resume.username
        elif resume.gender == "Female":
            return resume.username+"(女)"
        else:
            return resume.username

    def get_lastmod(self, resume):
        return (str(resume.last_modified.strftime("%Y/%m/%d %H:%M"))) 

    def get_expected(self, resume):
        #TODO: expected city and more
        expect = ""
        if resume.expected_province is not None:
            expect = expect + resume.expected_province
        if resume.expected_city is not None:
            expect = expect + resume.expected_city
        if resume.expected_district is not None:
            expect = expect + resume.expected_district
        if resume.expected_street is not None:
            expect = expect + resume.expected_street
        return expect

    def get_current_settle(self, resume):
        current_settle = ""
        if resume.current_settle_province is not None:
            current_settle += resume.current_settle_province
        if resume.current_settle_city is not None:
            current_settle += resume.current_settle_city
        if resume.current_settle_district is not None:
            current_settle += resume.current_settle_district
        if resume.current_settle_street is not None:
            current_settle += resume.current_settle_street

        return current_settle

    def get_birthorigin(self, resume):
        birth =""
        hasBirthInfo = False
        if resume.birth_province is not None:
            birth = birth + resume.birth_province
            hasBirthInfo = True
        if resume.birth_city is not None:
            birth = birth + "." + resume.birth_city
            hasBirthInfo = True
        if resume.birth_district is not None:
            birth = birth + "." + resume.birth_district
            hasBirthInfo = True
        if resume.birth_street is not None:
            birth = birth + "." + resume.birth_street
            hasBirthInfo = True
        if hasBirthInfo is False:
            return "无籍贯信息"
        return birth

    # by post id, can be is_in_interview for post1 but not for post2
    def get_workexp(self, resume):
        resume = Resume.objects.get(pk=resume.id)
        exps = resume.experience_set.all()

        if exps:
            expression = '</br>'.join([str(exp) for exp in exps])
            return expression
        else:
            return "--"
    def get_workexp_list(self,resume):
        resume = Resume.objects.get(pk=resume.id)
        exps = resume.experience_set.all()
        # 这里原本的company_name写的太偷懒了 直接把工作时间放到同一字段去了，截取字符串
        if exps:
            ls = []
            for e in exps:
                if e is not None:
                    s = e.company_name
                    if '（' in s:
                        ls.append(s[0:s.index('（')].strip())
            return ls
        else:
            return []


    def get_interview_id(self, resume):
        post_id = self.context.get('post_id')

        objs = Interview.objects.filter(post__pk=post_id, resume__pk=resume.id)
        if (objs):
            return objs[0].id
        else:
            return None

    def get_interview_status(self, resume):
        post_id = self.context.get('post_id')


        objs = Interview.objects.filter(post__pk=post_id, resume__pk=resume.id)
        if (objs):
            assert len(objs) == 1
            return objs[0].status
        else:
            # default 0
            return 0

    def get_interview_status_name(self, resume):
        post_id = self.context.get('post_id')

        # status_name such a complicated issue
        statusId = -1
        objsStatusId = Interview.objects.filter(post__pk=post_id, resume__pk=resume.id)
        if (objsStatusId):
            statusId = int(objsStatusId[0].status)

        objs = Interview.objects.filter(post__pk=post_id, resume__pk=resume.id)
        if (objs):
            assert len(objs) == 1
            # check the status
            if statusId == 3:# or statusId ==4:
                appointmentObjs = objs[0].interviewsub_appointment_set.all()
                #assert len(appointmentObjs) == 1
                if len(appointmentObjs) < 1:
                    return "--"
                #assert len(agreeObjs) == 1
                if appointmentObjs[len(appointmentObjs)-1].date is not None:
                    apstr = ""
                    # demo [{"district_id":"黄浦区","street_id":"小东门街道","address_suite":"恶趣味","linkman_name":"","linkman_phone":"","zp_status":"招聘中","addr_tag":""}]
                    post = Post.objects.get(id=post_id)
                    if post.extra_address != '' and post.extra_address is not None:
                        js = json.loads(post.extra_address)
                        for j in js:
                            logger.info("判断是否包含")
                            logger.info(
                                "{} in {}".format("{}{}".format(j.get('district_id', ''), j.get('street_id', '')),
                                                  appointmentObjs[len(appointmentObjs)-1].address))
                            if ("{}{}".format(j.get('district_id', ''), j.get('street_id', ''))) in appointmentObjs[
                                len(appointmentObjs)-1].address:
                                if appointmentObjs[len(appointmentObjs)-1].date is None:
                                    return "{} {}".format(j.get('addr_tag', ''),
                                                   appointmentObjs[len(appointmentObjs)-1].date)
                                return "{} {}".format(j.get('addr_tag', ''),
                                                      appointmentObjs[len(appointmentObjs)-1].date.strftime("%m月%d日%H:%M"))

                    # i = 1
                    # apstr = ""
                    # for ap in appointmentObjs:
                    #     apstr += "{}面-{}<br/>".format(str(i), ap.date.strftime("%m/%d"))
                    #     i += 1

                    return '--'
                    # return "{}".format(appointmentObjs[0].date.strftime("%m月%d日%H:%M"))

                    # return "约定面试: "+appointmentObjs[0].date.strftime("%Y/%m/%d %H:%M:%S")
                else:
                    agreeObjs = appointmentObjs[0].interviewsub_appointment_agree_set.all()
                    if len(agreeObjs) > 0:
                        apstr = ""
                        # demo [{"district_id":"黄浦区","street_id":"小东门街道","address_suite":"恶趣味","linkman_name":"","linkman_phone":"","zp_status":"招聘中","addr_tag":""}]
                        post = Post.objects.get(id=post_id)
                        if post.extra_address != '' and post.extra_address is not None:
                            js = json.loads(post.extra_address)
                            for j in js:
                                logger.info("判断是否包含")
                                logger.info(
                                    "{} in {}".format("{}{}".format(j.get('district_id', ''), j.get('street_id', '')),
                                                      appointmentObjs[0].address))
                                if ("{}{}".format(j.get('district_id', ''), j.get('street_id', ''))) in appointmentObjs[
                                    0].address:
                                    if appointmentObjs[0].date is None:
                                        return "{} {}".format(j.get('addr_tag', ''),
                                                              appointmentObjs[0].date)
                                    try:
                                        return "{} {}".format(j.get('addr_tag', ''),
                                                          appointmentObjs[0].date.strftime("%m月%d日%H:%M"))
                                    except:
                                        return "{} {}".format(j.get('addr_tag', ''),
                                                              appointmentObjs[0].date)

                        # i = 1
                        # apstr = ""
                        # for ap in appointmentObjs:
                        #     apstr += "{}面-{}<br/>".format(str(i), ap.date.strftime("%m/%d"))
                        #     i += 1

                        if appointmentObjs[0].date is None:
                            return "{}".format(appointmentObjs[0].date)
                        return "{}".format(appointmentObjs[0].date.strftime("%m月%d日%H:%M"))
                        # return "约定面试: "+appointmentObjs[0].date.strftime("%Y/%m/%d %H:%M:%S")
                        # i = 1
                        # apstr = ""
                        # for ap in appointmentObjs:
                        #     apstr += "{}面-{}<br/>".format(str(i), ap.date.strftime("%m/%d"))
                        #     i += 1
                        #
                        # return apstr
                        # return "约定面试: "+agreeObjs[0].date.strftime("%Y/%m/%d %H:%M:%S")
                    else:
                        return "无该同学面试时间信息"
                # the interview status, we should show the interview time
            elif statusId == 4:
                # 修改为最后一次面试的时间 评价

                # offerObjs = objs[0].interviewsub_offer_set.all()
                if objs[0].sub_status == '待定':
                    return "待定"

                offerObjs = InterviewSub_Interview.objects.filter(interview=objs[0])
                if len(offerObjs) > 0:
                    logger.info("offerObjs={}".format(offerObjs))
                    txt = "{} {}".format(objs[0].last_modified.strftime("%m月%d日%H:%M"), offerObjs[0].comments)
                    return txt
                else:
                    return "--"

                # if len(offerObjs) < 1:
                #     return "请填写offer信息"
                # offerAgreeObjs = offerObjs[0].interviewsub_offer_agree_set.all()
                # if len(offerAgreeObjs) < 1:
                #     return "请填写offer信息"
                # if offerAgreeObjs[0].date is None:
                #     return "请填写offer入职时间信息"
                # else:
                #     return "预期入职: " + offerAgreeObjs[0].date.strftime("%Y/%m/%d %H:%M:%S")
            elif statusId == 5:
                offerObjs = objs[0].interviewsub_offer_set.all()
                if len(offerObjs) < 1:
                    return "无该同学offer信息"
                offerAgreeObjs = offerObjs[0].interviewsub_offer_agree_set.all()
                if len(offerAgreeObjs) < 1:
                    return "无该同学offer信息"
                if offerAgreeObjs[0].date is None:
                    return "无该同学入职时间信息"
                else:
                    i = 1
                    apstr = ""
                    for ap in offerAgreeObjs:
                        apstr += "入职{}-{}<br/>".format(str(i), ap.date.strftime("%m/%d"))
                        i += 1

                    return apstr
                    # return "预期入职: " + offerAgreeObjs[0].date.strftime("%Y/%m/%d %H:%M:%S")
            elif statusId == 6:
                offerObjs = objs[0].interviewsub_offer_set.all()
                #print('offerObjs:',offerObjs)
                ruzhi = 0              
                if len(offerObjs) < 1:
                    return "入职天数:0"
                else:
                    if offerObjs[0].date is not None:
                         #offerObjs[0].date = offerObjs[0].date.replace('+00:00','')
                         #day1 = time.strptime(str(offerObjs[0].date), '%Y-%m-%d')
                         return "入职时间:{}".format(offerObjs[0].date) 
                     #  ruzhi = time_long(offerObjs[0].date, time.time())  
                      # return "入职时间:{}".format(offerObjs[0].date)              
                #offerAgreeObjs = offerObjs[0].interviewsub_offer_agree_set.all()
                #if len(offerAgreeObjs) < 1:
                #    ruzhi = 0
                #if offerAgreeObjs[0].date is not None:
                #    ruzhi = time_long(offerAgreeObjs[0].date, time.time())

                return "入职天数:{}".format(ruzhi)
            else:
                return objs[0].sub_status
        else:
            # default 0
            # which means there are no items yet, show the ai
            resumeObjs = Resume.objects.filter(pk=resume.id)
            interviewObjs = Interview.objects.filter(resume__pk=resume.id)
            if resumeObjs and interviewObjs and len(resumeObjs)==1: # a valid resume
                if resumeObjs[0].callInstanceId is not None:
                    duration = resumeObjs[0].callPhoneDuration
                    jobname = resumeObjs[0].callJobname
                    tags = resumeObjs[0].callTags
                    #return jobname + "/" + duration + "/" + tags + "\n\r"
                    if jobname is None:
                        jobname = "unknownJob"
                    if tags is None:
                        tags = "notags"
                    if duration is None:
                        duration = "-1s"

                    return jobname + "/" + tags + "\n\r"
                    # return "AI历史: " + jobname + "/" + duration + "/" + tags + "\n\r"
                    # No instance Info in resume info
                for interview in interviewObjs:
                    if interview.callInstanceId is not None:
                        print("Found a valid instance info")
                        phoneLog, duration, jobname, tags = get_instance_info(interview.callInstanceId)
                        # save the info to resume info
                        resumeObjs[0].callInstanceId = interview.callInstanceId
                        resumeObjs[0].callPhoneDuration = duration
                        resumeObjs[0].callTags = tags
                        resumeObjs[0].callJobname = jobname

                        resumeObjs[0].save()
                        return jobname + "/" + tags + "\n\r"
                        # return "AI历史: " + jobname + "/" + duration + "/" + tags + "\n\r"
                        #return "AI项目名(" + jobname + ")\n\r" + "时长(" + duration + ")\n\r" + "标签(" + tags + ")\n\r"
                        # No interview info
                return "Never call AI before"

            return "Never call AI before B"

    class Meta:
        model = Resume
        fields = (
            # MethodField
            'resume_way',
            'resume_way2',
            'interview_id',
            'candidate_id',
            'id',
            'interview_status',
            'interview_status_name',
            'workexp',
            'workexp_list',
            'ageg',
            'age',
            'newname',
            'birthorigin',
            'expected',
            'current_settle',
            'majorfull',
            'lastmod',
            'ai_called',

            # CascadeField
            'candidate',

            # OrdinaryField

            'resume_id',
            'visible',
            'username',
            'gender',
            'birth_year',
            'birth_month',
            'birth_day',
            'date_of_birth',
            'identity',
            'age',
            'hunting_status',

            'importer',

            'phone_number',
            'live_state',           
            'qq',
            'residence',
            'email',
            'marriage',

            'degree',
            'major',
            'school',

            'birth_province',
            'birth_city',
            'birth_district',
            'birth_street',

            'current_settle_province',
            'current_settle_city',
            'current_settle_district',
            'current_settle_street',

            'expected_province',
            'expected_city',
            'expected_district',
            'expected_street',

            'current_settle_province',
            'current_settle_city',
            'current_settle_district',
            'current_settle_street',
            'current_settle_xx',

            'expected_industry',
            'expected_salary',
            'expected_post',
            'expected_restmodel',
            'expected_insurance_place_type',
            'expected_insurance_time_type',

            'graduate_time',
            'graduate_year',

            'last_modified',

        )

    def create(self, validated_data):
#        try:
#            candidate_data = validated_data.pop('candidate')
#            candidate = CandidateSerializer.create(CandidateSerializer(), validated_data=candidate_data)

#            resume, created = Resume.objects.update_or_create(
#                candidate=candidate, **validated_data)
#            return resume
#        except KeyError:

#            resume = Resume.objects.create(**validated_data)
#            return resume

        # create resume, currently we use the phone as key to identify one resume
        resumeTarget = None
        try:
            phone=validated_data['phone_number']
            if phone == '':
                return None
            resumeTarget = Resume.objects.get(phone_number=phone)
        except:
            pass
        if resumeTarget is None:
            candidate_data = validated_data.pop('candidate')
            resume = Resume.objects.create(**validated_data)
            return resume
        else:
            return resumeTarget

class EducationSerializer(serializers.ModelSerializer):

    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    # REFER TO: ExperienceSerializer
    class Meta:
        model = Education
        fields = (
            'id',
            'resume', # foreginkey
            'start',
            'end',
            'school',
            'college',
            'major',
            'degree',
            'edu_type',
            'province',
            'city',
            'district',
            'street',
            'place',
            'instructor',
            'instructor_phone',
        )

class LabelScoreSerializer(serializers.ModelSerializer):

    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    # REFER TO: EducationSerializer
    class Meta:
        model = LabelScore
        fields = (
            'id',
            'resume', # foreginkey
            'label',
            'last_modified',
            'created',
            'val',
            'score'
        )

class LabelScoreLogSerializer(serializers.ModelSerializer):

    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    # REFER TO: EducationSerializer
    class Meta:
        model = LabelScoreLog
        fields = (
            'id',
            'resume', # foreginkey
            'val',
            'last_modified',
            'created',
            'label',
            'num',           
            'score'
        )    

class AddResumeSerializer(serializers.ModelSerializer):

    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    class Meta:
        model = Resume
        fields = (
            'id',
            'username', 
            'gender',
            'degree',
            'phone_number',
            'live_state',   
            'age',
            'graduate_year',
            'birth_province',  
            'birth_city', 
            'birth_district',
            'birth_street',                     
        )

class TagSerializer(serializers.ModelSerializer):

    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    # REFER TO: EducationSerializer
    class Meta:
        model = Tag
        fields = (
            'id',
            'resume', # foreginkey
            'tag',
            'last_modified',
            'post_id',
            'interview_id',           
            'interview_status',
            'created',
            'step',
            'operator'
        )
        
class OperatorLogSerializer(serializers.ModelSerializer):

    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    # REFER TO: EducationSerializer
    class Meta:
        model = OperatorLog
        fields = (
            'id',
            'resume', # foreginkey
            'col',
            'last_modified',
            'created',
            'val',
            'remark'
        )


class LabelLibSerializer(serializers.ModelSerializer):
    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    # REFER TO: EducationSerializer
    class Meta:
        model = LabelLib
        fields = (
            'id',
            'name',
            'kind',
            'sort',
            'deleted',
            'parent',
            'created'
        )

    def get_id(self, lib):
        return lib.id

    def get_name(self, lib):
        return lib.name

    def get_kind(self, lib):
        return lib.kind

    def get_sort(self, lib):
        return lib.sort

    def get_deleted(self, lib):
        return lib.deleted

    def get_parent(self, lib):
        return lib.parent
